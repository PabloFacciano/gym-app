<template>
  <!-- AppUser -->
  <div>
    <AppNavbar />
    <div>
      <table>
        <tr>
          <td>id</td>
          <td>{{ user?.id }}</td>
        </tr>
        <tr>
          <td>name</td>
          <td>{{ user?.name }}</td>
        </tr>
        <tr>
          <td>email</td>
          <td>{{ user?.email }}</td>
        </tr>
        <tr>
          <td>picture</td>
          <td>
            <img
              class="h-10 w-10 rounded-full"
              :src="user?.picture ?? 'https://placehold.co/40x40?text=??'"
              :alt="user?.name ?? 'user avatar'"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import AppNavbar from '@/custom/AppNavbar.vue'
import { AuthStore } from '@/stores/auth'
import { mapState } from 'pinia'
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
  },
  watch: {},
  computed: {
    ...mapState(AuthStore, ['user']),
  },
  methods: {},
  mounted() {
    //
  },
})
</script>
