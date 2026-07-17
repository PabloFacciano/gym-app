<template>
  <div>GymApp</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppLandingPage',
  props: {},
  data(): State {
    return {}
  },
  components: {},
  watch: {},
  computed: {},
  methods: {},
  mounted() {
    this.$router.push('/login')
  },
})
</script>
