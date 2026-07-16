<template>
  <div class="bg-neutral-50 min-h-screen flex flex-col">
    <RouterView class="grow"></RouterView>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia'
import { mainStore } from '@/stores/main'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import AppError404 from './pages/AppError404.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppError404,
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    ...mapState(mainStore, []),
  },
  methods: {
    ...mapActions(mainStore, []),
  },
})
</script>

<style>
@import 'tailwindcss';
@import 'vue3-toastify/dist/index.css';

@theme {
  /* Define the palette scale */
  --color-app-50: #007acc;
}

/* Standard resets if not already handled by your Tailwind config */
body {
  @apply bg-neutral-50 text-neutral-900;
}
</style>
