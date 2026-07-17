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
  name: 'AppUser',
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
