<template>
  <div class="space-y-4 rounded bg-neutral-700 px-6 py-4 shadow sm:space-y-6 sm:p-6">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppCard',
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
