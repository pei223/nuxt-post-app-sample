<template>
  <div>
    <v-container>
      <v-card class="card">
        <v-text-field v-model="name" label="name" />
        <v-text-field type="password" v-model="password" label="password" />
        <v-btn @click="submit" color="info">login</v-btn>
      </v-card>
    </v-container>
    <v-dialog v-model="openErrorDialog">
      <v-card>
        <v-card-title>
          {{ errorDialogMessage }}
        </v-card-title>
        <v-card-text> 入力値を再度確認してください。 </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Vue from 'vue'
import { loginRequest } from '../../apis/authApi'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/services/error'

interface Data {
  name: string
  password: string
  openErrorDialog: boolean
  errorDialogMessage: string
}

export default Vue.extend({
  data(): Data {
    return {
      name: '',
      password: '',
      errorDialogMessage: '',
      openErrorDialog: false,
    }
  },
  methods: {
    async submit() {
      if (this.name === '' || this.password === '') {
        return
      }
      try {
        const res = await loginRequest({
          name: this.name,
          password: this.password,
        })
        appStore.setAccessToken(res.token)
        console.log(res)
        this.$router.push('/index')
      } catch (e) {
        this.openErrorDialog = true
        if (!axios.isAxiosError(e)) {
          this.$router.push(
            genErrorPath(this.$route.path, ERROR_CODE.notAxiosError)
          )
          return
        }
        if (!e.response) {
          this.$router.push(
            genErrorPath(this.$route.path, ERROR_CODE.networkError)
          )
          return
        }
        switch (e.response.status) {
          case 401:
            this.errorDialogMessage = '認証エラー'
            return
          default:
            this.$router.push(
              genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError)
            )
        }
      }
    },
  },
})
</script>

<style scoped>
.card {
  padding: 30px;
}
</style>
