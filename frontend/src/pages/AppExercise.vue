<template>
  <div>
    <AppNavbar />
  </div>
</template>

<script lang="ts">
import AppNavbar from '@/custom/AppNavbar.vue';
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppExcercise',
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
