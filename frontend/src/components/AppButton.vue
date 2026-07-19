<template>
  <button
    type="button"
    class="rounded select-none focus:outline-none"
    :class="{
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled,
      'bg-app hover:bg-app-dark active:bg-app-darker active:border-app-darker text-neutral-200':
        !disabled && type == 'primary',
      'bg-app-dark text-neutral-700': disabled && type == 'primary',
      'border-app text-neutral-200 hover:bg-app-dark hover:border-app-dark active:bg-app-darker active:border-app-darker border':
        !disabled && type == 'secondary',
      'border-app-dark border text-neutral-400': disabled && type == 'secondary',
      'bg-red-600 text-neutral-200 hover:bg-red-700 active:bg-red-800':
        !disabled && type == 'danger',
      'bg-red-600 text-red-300': disabled && type == 'danger',
      'px-6 py-3 text-lg': size == 'lg',
      'text-md px-4 py-2': size == 'md',
      'px-3 py-1 text-sm': size == 'sm',
    }"
    @click="buttonClick"
  >
    <slot>Button Text</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['click'],
  name: 'AppButton',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    type: {
      type: String,
      required: false,
      default: 'primary', // 'primary' | 'secondary' | 'danger'
    },
    size: {
      type: String,
      required: false,
      default: 'md', // 'sm' | 'md' | 'lg'
    },
  },
  data() {
    return {}
  },
  methods: {
    buttonClick() {
      if (this.disabled) return
      this.$emit('click')
    },
  },
})
</script>
