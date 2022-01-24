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
          title: 'ログイン',
          to: '/auth/login',
        },
        {
          icon: 'mdi-apps',
          title: 'アカウント登録',
          to: '/auth/signup',
        },
      ],
      title: 'Post app',
    }
  },
})
</script>
