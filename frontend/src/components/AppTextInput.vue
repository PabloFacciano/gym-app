<template>
  <div class="relative w-full font-sans">
    <!-- Main Input Area -->
    <div
      class="group relative flex items-center rounded-lg border-1 transition-all duration-200"
      :class="[
        isInternallyValid ? 'bg-neutral-800' : '',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-700',
        !disabled && !isFocused ? 'border-neutral-600' : '',
        isFocused ? 'border-app ring-app ring-2' : '',
        !isInternallyValid ? 'border-red-500 bg-neutral-900' : '',
      ]"
    >
      <textarea
        v-if="type == 'textarea'"
        rows="6"
        class="w-full cursor-text bg-transparent px-4 py-3 break-all outline-none"
        :class="{
          'font-semibold text-neutral-200': modelValue && isInternallyValid,
          'placeholder-neutral-600': !modelValue,
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
        :type="type"
        class="w-full cursor-text bg-transparent px-4 py-3 outline-none"
        :class="{
          'font-semibold text-neutral-200': modelValue && isInternallyValid,
          'placeholder-neutral-600': !modelValue,
        }"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :value="modelValue"
        :min="minimun"
        :max="maximun"
        @input="handleInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Validation Icons (Emoji) -->
      <div v-if="hasBeenTouched" class="flex items-center gap-2 pr-4">
        <span v-if="isInternallyValid" title="Valid" class="text-lg text-green-600">&#10003;</span>
        <span v-else title="Invalid" class="text-lg text-red-400">&#10005;</span>
      </div>
    </div>

    <!-- Error / Helper Message -->
    <div
      class="my-2 flex min-h-[1.25rem] items-center justify-between px-1"
      v-if="(required && !modelValue) || (!isInternallyValid && errorMessage)"
    >
      <span v-if="required && !modelValue" class="text-sm text-red-400">
        &#9650; Este campo es obligatorio.
      </span>
      <span v-else-if="!isInternallyValid && errorMessage" class="text-sm text-red-400">
        {{ '&#9650;' + errorMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'AppTextInput',
  emits: ['update:modelValue', 'blur', 'focus'],
  props: {
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
    minimun: {
      type: Number,
      required: false,
    },
    maximun: {
      type: Number,
      required: false,
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
