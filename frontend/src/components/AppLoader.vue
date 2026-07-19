<template>
  <div class="flex flex-col items-center justify-center space-y-4 p-8">
    <div
      class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"
    ></div>
    <div><slot>Espera un momento...</slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: '???',
  props: {},
  data(): State {
    return {}
  },
  components: {},
  watch: {},
  computed: {},
  methods: {},
  mounted() {
    //
  },
})
</script>
