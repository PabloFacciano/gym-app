<template>
  <div class="p-8 space-y-4">
    <h1 class="text-2xl">Error 404</h1>
    <p>Página no encontrada</p>
    <p><button @click="goBack" class="text-app underline cursor-pointer">Volver atrás</button></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppError404',
  data() {
    return {}
  },
  components: {},
  computed: {},
  methods: {
    goBack(){
      // If there is no previous internal history state, redirect to a fallback home route
      if (window.history.state && window.history.state.back === null) {
        this.$router.push("/");
      } else {
        this.$router.back();
      }
    }
  },
})
</script>
