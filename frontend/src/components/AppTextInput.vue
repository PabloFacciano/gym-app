<template>
  <div class="relative w-full font-sans">
    <!-- Main Input Area -->
    <div
      class="group relative flex items-center bg-neutral-100 rounded-lg transition-all duration-200 border-2"
      :class="[
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-200',
        isFocused ? 'border-accentteams-600 ring-2 ring-accentteams-100' : 'border-transparent',
        !isInternallyValid ? 'border-red-500 bg-red-50' : '',
      ]"
    >
      <textarea
        v-if="type == 'textarea'"
        rows="6"
        :id="id"
        class="w-full bg-transparent px-4 py-3 outline-none cursor-text break-all"
        :class="{
          'font-semibold text-neutral-800': modelValue && isInternallyValid,
          'placeholder-neutral-400': !modelValue,
        }"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        @input="handleInput"
        @focus="onFocus"
        @blur="onBlur"
      >
      </textarea>
      <input
        v-else
        :id="id"
        :type="type"
        class="w-full bg-transparent px-4 py-3 outline-none cursor-text"
        :class="{
          'font-semibold text-neutral-800': modelValue && isInternallyValid,
          'placeholder-neutral-400': !modelValue,
        }"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :value="modelValue"
        @input="handleInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Validation Icons (Emoji) -->
      <div v-if="hasBeenTouched" class="pr-4 flex items-center gap-2">
        <span v-if="isInternallyValid" title="Valid" class="text-green-600 text-lg">✅</span>
        <span v-else title="Invalid" class="text-red-600 text-lg">✖️</span>
      </div>
    </div>

    <!-- Error / Helper Message -->
    <div
      class="flex justify-between items-center mt-2 px-1 min-h-[1.25rem]"
      v-if="(required && !modelValue) || (!isInternallyValid && errorMessage)"
    >
      <transition name="fade">
        <span v-if="required && !modelValue" class="text-sm text-red-600">
          Este campo es obligatorio.
        </span>
        <span v-else-if="!isInternallyValid && errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'AppTextInput',
  emits: ['update:modelValue', 'blur', 'focus'],
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: 'Ingresa el texto...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: 'No es válido.',
    },
    maxlength: {
      type: Number,
      default: null,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isFocused: false,
      hasBeenTouched: false,
    }
  },
  computed: {
    isInternallyValid(): boolean {
      // 1. Check Required
      if (this.required && (!this.modelValue || String(this.modelValue).trim() === '')) {
        return false
      }
      // 2. Custom Validation Logic
      return this.isValid
    },
  },
  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('update:modelValue', target.value)
    },
    onFocus() {
      this.isFocused = true
      this.$emit('focus')
    },
    onBlur() {
      this.isFocused = false
      this.hasBeenTouched = true
      this.$emit('blur')
    },
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
