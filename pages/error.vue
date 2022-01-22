<template>
  <div>
    <v-col justify="center" align="center">
      <p>{{ errorMessage }}</p>
      <p v-if="errorCode">{{ errorCode }}</p>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ERROR_CODE, parseErrorId } from '~/services/error'

export default Vue.extend({
  head: {
    meta: [{ name: 'robots', content: 'noindex' }],
  },
  computed: {
    errorMessage(): string {
      const error = parseErrorId(this.$route.query.id as string)
      switch (error.code) {
        case ERROR_CODE.networkError:
          return 'ネットワーク未接続です。'
        case ERROR_CODE.unexpectedApiError:
          return '予期せぬAPIエラーです。'
        case ERROR_CODE.notFound:
          return '存在しないデータです。'
        case ERROR_CODE.notAxiosError:
          return '予期せぬエラーです。'
      }
      return ''
    },
    errorCode(): string | null {
      const error = parseErrorId(this.$route.query.id as string)
      if (
        error.code === ERROR_CODE.networkError ||
        error.code === ERROR_CODE.notFound
      ) {
        return null
      }
      return this.$route.query.id as string
    },
  },
})
</script>
