<template>
  <!-- AppHome -->
  <div>
    <AppNavbar />
    <div>Home</div>
  </div>
</template>

<script lang="ts">
import AppNavbar from '@/custom/AppNavbar.vue';
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppHome',
  props: {},
  data(): State {
    return {}
  },
  components: {
    AppNavbar
  },
  watch: {},
  computed: {},
  methods: {},
  mounted() {
    //
  },
})
</script>
