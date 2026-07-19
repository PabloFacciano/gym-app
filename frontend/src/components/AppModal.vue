<template>
  <!-- Backdrop and Dialog Container -->
  <dialog
    ref="modalRef"
    class="open:animate-in open:fade-in-0 open:zoom-in-95 fixed inset-0 m-auto w-full max-w-lg rounded-xl border border-neutral-700 bg-neutral-800 shadow-2xl transition-all backdrop:bg-neutral-900/50 backdrop:backdrop-blur-sm"
    @close="handleClose"
  >
    <!-- Header -->
    <header
      class="flex items-center justify-between border-b border-neutral-700 bg-neutral-700 p-4"
    >
      <h3 class="text-lg font-semibold text-neutral-200">
        {{ title }}
      </h3>
      <button
        type="button"
        class="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-400"
        @click="closeModal"
      >
        <span class="sr-only">Cerrar</span>
        <!-- Simple X Icon -->
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Main Content Body -->
    <div class="p-6 text-sm text-neutral-400">
      <slot></slot>
    </div>

    <!-- Footer Actions -->
    <footer
      class="flex items-center justify-end gap-3 border-t border-neutral-700 bg-neutral-800 p-4"
    >
      <AppButton
        v-if="primaryButtonText"
        size="md"
        :disabled="false"
        type="primary"
        @click="onPrimaryClick"
        >{{ primaryButtonText }}</AppButton
      >
      <AppButton
        v-if="secondaryButtonText"
        size="md"
        :disabled="false"
        type="secondary"
        @click="onSecondaryClick"
        >{{ secondaryButtonText }}</AppButton
      >
    </footer>
  </dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppButton from './AppButton.vue'

export default defineComponent({
  name: 'AppModal',
  props: {
    title: {
      type: String,
      default: 'Modal Title',
    },
    primaryButtonText: {
      type: String,
      default: '',
    },
    secondaryButtonText: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['primaryButtonClicked', 'secondaryButtonClicked', 'update:isOpen'],
  components: {
    AppButton,
  },
  watch: {
    // Watch the isOpen prop to control the native HTML dialog element
    isOpen(newValue) {
      this.toggleModal(newValue)
    },
  },
  mounted() {
    // Sync initial state if opened on mount
    if (this.isOpen) {
      this.toggleModal(true)
    }
  },
  methods: {
    toggleModal(shouldOpen) {
      const modal = this.$refs.modalRef
      if (!modal) return

      if (shouldOpen && !modal.open) {
        modal.showModal()
      } else if (!shouldOpen && modal.open) {
        modal.close()
      }
    },
    closeModal() {
      this.$emit('update:isOpen', false)
    },
    handleClose() {
      // Handles native ESC key close event
      if (this.isOpen) {
        this.closeModal()
      }
    },
    onPrimaryClick() {
      this.$emit('primaryButtonClicked')
    },
    onSecondaryClick() {
      this.$emit('secondaryButtonClicked')
    },
  },
})
</script>
