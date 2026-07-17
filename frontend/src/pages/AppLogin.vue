<template>
  <div class="flex flex-col p-4 text-center">
    <div class="flex flex-1 flex-col items-center justify-center space-y-12">
      <div class="space-y-6">
        <div class="text-5xl">GymApp</div>
        <div>Mide el progreso mientras vas al gimnasio.</div>
      </div>
      <div class="flex w-1/2 flex-col items-center justify-center space-y-3">
        <AppButton size="lg" type="primary" @click="login">Ingresar con Google</AppButton>
        <AppButton size="lg" type="secondary">¿Por qué GymApp?</AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppButton from '@/components/AppButton.vue'
import { defineComponent } from 'vue'
import { AuthStore } from '@/stores/auth'
import { mapActions } from 'pinia'

interface State {}

export default defineComponent({
  name: 'AppLogin',
  props: {},
  data(): State {
    return {}
  },
  components: {
    AppButton,
  },
  watch: {},
  computed: {},
  methods: {
    ...mapActions(AuthStore, ['signIn']),
    async login() {
      try {
        await this.signIn()
      } catch (error) {
        window.alert('Login Error')
      }
    },
  },
  mounted() {
    //
  },
})
</script>
