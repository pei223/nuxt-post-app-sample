<template>
  <div>
    <v-container>
      <v-card class="card">
        <v-card-title><Heading title="ログイン" /></v-card-title>
        <v-text-field
          v-model="name"
          label="name"
          :error-messages="nameErrorMessage"
          @focus="onNameFocus"
        />

        <v-text-field
          v-model="password"
          type="password"
          label="password"
          :error-messages="passwordErrorMessage"
          @focus="onPasswordFocus"
        />
        <v-btn
          width="100%"
          class="submit-button"
          color="secondary"
          @click="submit"
          >login</v-btn
        >
      </v-card>
    </v-container>
    <v-dialog v-model="errorDialogOpen">
      <v-card>
        <v-card-title>
          {{ errorDialogMessage }}
        </v-card-title>
        <v-card-text> 入力した値を再度確認してください。 </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Vue from 'vue'
import { loginRequest } from '../../apis/authApi'
import { ErrorResponse } from '../../apis/ErrorResponse'
import Heading from '../../components/atoms/Heading.vue'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'

interface Data {
  name: string
  password: string
  nameErrorMessage: string
  passwordErrorMessage: string
  errorDialogMessage: string
  errorDialogOpen: boolean
}

export default Vue.extend({
  components: { Heading },
  data(): Data {
    return {
      name: '',
      password: '',
      nameErrorMessage: '',
      passwordErrorMessage: '',
      errorDialogMessage: '',
      errorDialogOpen: false,
    }
  },
  head() {
    return {
      title: 'ログイン',
    }
  },
  methods: {
    async submit() {
      if (this.name === '' || this.password === '') {
        return
      }
      this.nameErrorMessage = ''
      this.passwordErrorMessage = ''
      this.errorDialogMessage = ''

      try {
        const res = await loginRequest({
          name: this.name,
          password: this.password,
        })
        appStore.setAccessToken(res.token)
        appStore.setUser(res)
        this.$router.push(
          !this.$route.query.redirectUrl
            ? '/posts/me'
            : (this.$route.query.redirectUrl as string)
        )
      } catch (e) {
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
        const errorResponse = e.response.data as ErrorResponse
        switch (e.response.status) {
          case 401:
            this.errorDialogOpen = true
            this.errorDialogMessage = '認証エラー'
            return
          case 400:
            this.nameErrorMessage = errorResponse.data.name ?? ''
            this.passwordErrorMessage = errorResponse.data.password ?? ''
            return
          default:
            this.$router.push(
              genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError)
            )
        }
      }
    },
    onNameFocus() {
      this.nameErrorMessage = ''
    },
    onPasswordFocus() {
      this.passwordErrorMessage = ''
    },
  },
})
</script>

<style scoped>
.submit-button {
  margin-top: 40px;
}
.card {
  padding: 30px;
}
</style>
