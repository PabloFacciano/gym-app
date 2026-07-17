<template>
  <button
    type="button"
    class="focus:outline-none rounded"
    :class="{
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled,
      'bg-app hover:bg-app-dark active:bg-app-darker active:border-app-darker': !disabled && type == 'primary',
      'border border-app hover:bg-app-dark hover:border-app-dark hover:text-neutral-200 active:bg-app-darker active:border-app-darker': !disabled && type == 'secondary',
      'px-6 py-3 text-lg': size == 'lg',
      'px-4 py-2 text-md': size == 'md',
      'px-2 py-1 text-sm': size == 'sm'

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
      default: 'primary' // 'primary' | 'secondary' | 'danger'
    },
    size: {
      type: String,
      required: false,
      default: 'md' // 'sm' | 'md' | 'lg'
    }
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
