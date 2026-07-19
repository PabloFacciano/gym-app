<template>
  <div class="flex flex-col items-center p-3 sm:p-8">
    <div class="flex w-full flex-col space-y-3 sm:w-140 sm:space-y-6">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppCenter',
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
