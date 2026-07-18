<template>
  <!-- AppUser -->
  <div>
    <AppNavbar />
    <!-- Profile -->
    <div class="bg-neutral-600 p-8 flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:space-x-6 items-center">
      <div class="flex justify-center items-center text-center sm:text-start sm:order-1">
        <img
          class="w-20 h-auto rounded-full"
          :src="user?.picture ?? 'https://placehold.co/40x40?text=??'"
          :alt="user?.name ?? 'user avatar'"
        />
      </div>

      <div class="flex flex-col space-y-2 text-center sm:text-start sm:order-1">
        <div class="text-2xl font-medium">{{ user?.name }}</div>
        <div>{{ user?.email }}</div>
      </div>
    </div>
    <!-- Actions -->
    <div class="py-8 px-4 sm:px-8">
      <div class="flex flex-col sm:flex-row">
        <AppButton size="md" type="secondary" @click="signOut_click">Cerrar Sesión</AppButton>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import AppButton from '@/components/AppButton.vue';
import AppNavbar from '@/custom/AppNavbar.vue'
import { AuthStore } from '@/stores/auth'
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppUser',
  props: {},
  data(): State {
    return {}
  },
  components: {
    AppNavbar,
    AppButton
  },
  watch: {},
  computed: {
    ...mapState(AuthStore, ['user']),
  },
  methods: {
    ...mapActions(AuthStore, [ 'signOut' ]),
    async signOut_click(){
      try {
        await this.signOut()
      } catch (error) {
        window.alert('SignOut Error')
      }
    }
  },
  mounted() {
    //
  },
})
</script>
