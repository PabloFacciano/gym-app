<template>
  <div class="relative w-full font-sans" v-click-outside="closeList">
    <!-- Main Input / Trigger Area -->
    <div
      class="group relative flex items-center rounded-lg border-1 bg-neutral-900 transition-all duration-200"
      :class="[
        isInternallyValid ? 'bg-neutral-800' : '',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-700',
        !disabled && !isFocused ? 'border-neutral-600' : '',
        isFocused ? 'border-app ring-app ring-2' : '',
        !isInternallyValid ? 'border-red-500 bg-neutral-900' : '',
      ]"
      @click="toggleList"
    >
      <input
        ref="inputRef"
        type="text"
        class="w-full cursor-text bg-transparent px-4 py-3 outline-none"
        :class="{
          'font-semibold placeholder-neutral-200': selectedOption && isInternallyValid,
          'placeholder-neutral-600': !selectedOption || !isInternallyValid,
        }"
        :placeholder="selectedOption ? selectedOption.label : 'Select an option'"
        :readonly="!isSearchable || disabled"
        :disabled="disabled"
        v-model="internalSearch"
        @focus="onFocus"
        @blur="onBlur"
        @click.stop
        @keydown.enter.prevent="selectFirstFiltered"
        @keydown.esc="revertAndClose"
      />

      <!-- Validation Icons (Emoji) -->
      <div v-if="hasBeenTouched" class="flex items-center gap-2 pr-2">
        <span v-if="isInternallyValid" title="Valid" class="text-lg text-green-600">&#10003;</span>
        <span v-else title="Invalid" class="text-lg text-red-400">&#10005;</span>
      </div>

      <!-- Dropdown Arrow Area -->
      <div
        class="py-3 pr-4 text-xs text-neutral-400 transition-colors group-hover:text-neutral-600"
      >
        {{ isOpen ? '▲' : '▼' }}
      </div>
    </div>
    <!-- Label / Required Indicator -->
    <div class="mt-2 flex items-center justify-between px-1">
      <span v-if="required && !disabled && !isInternallyValid" class="text-sm text-red-400"
        >&#9650; This field is required.</span
      >
    </div>

    <!-- Dropdown List -->
    <transition name="fade">
      <div
        v-if="isOpen && !disabled"
        class="absolute z-50 mt-2 max-h-64 w-full overflow-hidden overflow-y-auto rounded-xl border border-neutral-900 bg-neutral-700 shadow-2xl"
      >
        <div v-if="filteredList.length > 0" class="py-3">
          <div
            v-for="item in filteredList"
            :key="String(item.value)"
            @mousedown="selectOption(item)"
            class="cursor-pointer border-t border-b px-4 py-3 transition-all duration-150"
            :class="[
              isItemSelected(item.value) && item.value
                ? 'border-app border-s-6 border-e-1 bg-neutral-800'
                : 'border-s-4 border-neutral-900 border-transparent hover:bg-neutral-900',
            ]"
          >
            <div
              class="font-medium"
              :class="{
                'text-neutral-200': isItemSelected(item.value) && item.value !== null,
                'text-neutral-300': !isItemSelected(item.value) && item.value !== null,
                'text-neutral-500': item.value == null,
              }"
            >
              {{ item.label }}
            </div>
            <div
              v-if="item.description || item.value"
              class="mt-1 font-mono text-xs break-all text-neutral-600"
            >
              {{ item.description ?? item.value }}
            </div>
          </div>
        </div>
        <div v-else class="px-4 py-8 text-center text-neutral-600 italic">
          No results found for "{{ internalSearch }}"
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, type Directive } from 'vue'

export type SelectOption = {
  label: string
  description: string
  value: string | number | boolean
}

export default defineComponent({
  name: 'AppDropdown',
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: [String, Number, Boolean] as PropType<string | number | boolean | null>,
      default: null,
    },
    list: {
      type: Array as PropType<SelectOption[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isOpen: false,
      isFocused: false,
      internalSearch: '' as string,
      lastValidValue: this.modelValue as string | number | boolean | null,
      hasBeenTouched: false,
    }
  },
  computed: {
    isSearchable(): boolean {
      return this.list.length > 5
    },
    selectedOption(): SelectOption | null {
      return this.list.find((opt) => opt.value === this.modelValue) || null
    },
    filteredList(): SelectOption[] {
      if (!this.internalSearch) return this.list
      const search = this.internalSearch.toLowerCase()
      return this.list.filter(
        (item) =>
          item.label.toLowerCase().includes(search) ||
          item.value.toString().toLowerCase().includes(search),
      )
    },
    isInternallyValid(): boolean {
      if (this.required && !this.modelValue) return false
      return this.isValid
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        this.lastValidValue = newVal
      },
    },
    isOpen(newVal) {
      if (!newVal) {
        this.internalSearch = ''
      }
    },
  },
  methods: {
    isItemSelected(value: string | number | boolean): boolean {
      return this.modelValue !== null && this.modelValue !== undefined && this.modelValue === value
    },
    toggleList() {
      if (this.disabled) return

      if (this.isOpen) {
        this.revertAndClose()
        ;(this.$refs.inputRef as HTMLInputElement | null)?.blur()
      } else {
        this.isOpen = true
        this.$nextTick(() => {
          ;(this.$refs.inputRef as HTMLInputElement | null)?.focus()
        })
      }
    },
    onFocus() {
      this.isFocused = true
      this.isOpen = true
      this.hasBeenTouched = true
    },
    onBlur() {
      this.isFocused = false
      // Only trigger revert if the user clicked away (list is still technically open in state)
      // but NOT if they clicked an option (which closes the list synchronously)
      setTimeout(() => {
        if (!this.isFocused && this.isOpen) {
          this.revertAndClose()
        }
      }, 200)
    },
    selectOption(option: SelectOption) {
      // Set local state first to prevent blur revert race condition
      this.lastValidValue = option.value
      this.isOpen = false
      this.internalSearch = ''

      this.$emit('update:modelValue', option.value)
      this.$emit('change', option.value)
    },
    selectFirstFiltered() {
      const firstItem = this.filteredList[0]
      if (firstItem) {
        this.selectOption(firstItem)
      } else {
        this.revertAndClose()
      }
    },
    revertAndClose() {
      this.$emit('update:modelValue', this.lastValidValue)
      this.isOpen = false
      this.internalSearch = ''
    },
    closeList() {
      if (this.isOpen) this.revertAndClose()
    },
  },
  directives: {
    'click-outside': {
      mounted(el: any, binding) {
        el.clickOutsideEvent = (event: Event) => {
          if (!(el === event.target || el.contains(event.target as Node))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el: any) {
        document.removeEventListener('click', el.clickOutsideEvent)
      },
    } as Directive,
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
