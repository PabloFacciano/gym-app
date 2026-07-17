<template>
  <!-- AppNavbar -->
  <div class="bg-sky-600 text-white text-xl text-start flex items-center space-x-4">
    <!-- Sidebar -->
    <Transition name="slide-left">
      <div
        v-if="showSidebar"
        @click="showSidebar = !showSidebar"
        class="flex flex-col bg-sky-600 shadow-sm fixed top-0 bottom-0 left-0 w-9/10 sm:w-auto sm:min-w-60 cursor-pointer"
      >
        <div class="p-4 border-b border-app-darker flex space-x-3 items-center">
          <img
            class="w-6 h-6"
            src="https://img.icons8.com/ffffff/ios-filled/50/back--v1.png"
            alt="menu--v1"
          />
          <div class="font-medium">GymApp</div>
        </div>

        <RouterLink
          class="p-4 border-b border-app-darker"
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          v-text="link.label"
        ></RouterLink>
      </div>
    </Transition>
    <!-- Navbar -->
    <button @click="showSidebar = !showSidebar" class="p-4 cursor-pointer">
      <img
        class="w-6 h-6"
        src="https://img.icons8.com/ffffff/ios-filled/50/menu--v1.png"
        alt="menu--v1"
      />
    </button>
    <RouterLink to="/app" class="font-medium">GymApp</RouterLink>
  </div>
</template>

<script lang="ts">
import { AuthStore } from '@/stores/auth'
import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

interface State {
  showSidebar: boolean
}

export default defineComponent({
  name: '???',
  props: {},
  data(): State {
    return {
      showSidebar: false,
    }
  },
  components: {},
  watch: {},
  computed: {
    ...mapState(AuthStore, ['user']),
    links() {
      return [
        { label: 'Inicio', to: '/app' },
        { label: 'Ejercicios', to: '/app/exercises' },
        { label: 'Mi Perfil', to: '/app/users/' + (this.user?.id ?? '') },
      ]
    },
  },
  methods: {},
  mounted() {
    //
  },
})
</script>

<style lang="css" scoped>

/* 1. Define active states for duration and timing function */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 2. Define starting state for entering & ending state for leaving */
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0; /* Optional: adds a fade effect along with the slide */
}

/* 3. Define ending state for entering & starting state for leaving (Optional) */
.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}


</style>