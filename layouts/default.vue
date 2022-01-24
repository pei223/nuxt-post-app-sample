<template>
  <v-app>
    <div v-if="logined">
      <Header />
    </div>
    <div v-else>
      <NoLoginHeader />
    </div>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import NoLoginHeader from '../components/blocks/NoLoginHeader.vue'
import Header from '../components/blocks/Header.vue'
import { appStore } from '~/store'

export default Vue.extend({
  components: { Header, NoLoginHeader },
  computed: {
    logined(): boolean {
      return appStore.accessToken !== ''
    },
  },
})
</script>
