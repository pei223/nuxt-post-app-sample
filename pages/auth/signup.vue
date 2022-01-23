<template>
  <div>
    <v-container>
      <v-card class="card">
        <v-card-title><Heading title="登録" /></v-card-title>

        <v-text-field
          v-model="email"
          label="e-mail"
          :error-messages="emailErrorMessage"
          @focus="onEmailFocus"
        />

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
          color="primary"
          @click="submit"
          >signup</v-btn
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
import { ErrorResponse } from '../../apis/ErrorResponse'
import { signupRequest } from '../../apis/authApi'
import Heading from '../../components/atoms/Heading.vue'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/services/error'

interface Data {
  email: string
  name: string
  password: string
  emailErrorMessage: string
  nameErrorMessage: string
  passwordErrorMessage: string
  errorDialogMessage: string
  errorDialogOpen: boolean
}

export default Vue.extend({
  components: { Heading },
  data(): Data {
    return {
      email: '',
      name: '',
      password: '',
      emailErrorMessage: '',
      nameErrorMessage: '',
      passwordErrorMessage: '',
      errorDialogMessage: '',
      errorDialogOpen: false,
    }
  },
  methods: {
    async submit() {
      if (this.name === '' || this.password === '' || this.email === '') {
        return
      }
      this.nameErrorMessage = ''
      this.passwordErrorMessage = ''
      this.emailErrorMessage = ''
      this.errorDialogMessage = ''

      try {
        const res = await signupRequest({
          email: this.email,
          name: this.name,
          password: this.password,
        })
        appStore.setAccessToken(res.token)
        this.$router.push('/posts/me')
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
          case 400:
            // TODO 重複の場合エラーコードが変わるがバックエンド側がまだそこまでできてない
            this.nameErrorMessage = errorResponse.data.name ?? ''
            this.passwordErrorMessage = errorResponse.data.password ?? ''
            this.emailErrorMessage = errorResponse.data.email ?? ''
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
    onEmailFocus() {
      this.emailErrorMessage = ''
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
