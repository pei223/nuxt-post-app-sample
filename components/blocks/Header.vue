<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
      temporary
    >
      <v-list>
        <v-list-item
          v-for="(menu, i) in menus"
          :key="i"
          :to="menu.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="menu.title" />
          </v-list-item-content>
        </v-list-item>

        <div class="logout-row">
          <v-divider />
          <v-list-item v-ripple @click="logout">
            <v-list-item-action>
              <v-icon>mdi-apps</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CookieService from '~/services/CookieService'
import { appStore } from '~/store'

type MenuInfo = {
  icon: string
  title: string
  to: string
}
type Data = {
  clipped: boolean
  drawer: boolean
  menus: MenuInfo[]
  title: string
}

export default Vue.extend({
  data(): Data {
    return {
      clipped: false,
      drawer: false,
      menus: [
        {
          icon: 'mdi-apps',
          title: '記事一覧',
          to: '/posts/',
        },
        {
          icon: 'mdi-apps',
          title: '自分の記事一覧',
          to: '/posts/me',
        },
        {
          icon: 'mdi-apps',
          title: '記事作成',
          to: '/posts/add',
        },
        {
          icon: 'mdi-apps',
          title: 'アカウント情報',
          to: '/self',
        },
      ],
      title: 'Post app',
    }
  },
  methods: {
    logout() {
      appStore.clear(new CookieService(document.cookie))
      this.$router.push('/auth/login')
    },
  },
})
</script>

<style scoped>
.logout-row {
  cursor: pointer;
  margin-top: 40px;
}
</style>
