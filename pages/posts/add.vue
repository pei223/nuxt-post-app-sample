<template>
  <div>
    <v-container>
      <v-card class="card">
        <v-card-title><Heading title="記事作成" /></v-card-title>

        <v-text-field
          v-model="title"
          label="タイトル"
          :error-messages="titleErrorMessage"
          @focus="onTitleFocus"
        />

        <v-row>
          <v-col>
            <v-textarea
              v-model="content"
              label="記事内容"
              rows="20"
              :error-messages="contentErrorMessage"
              @focus="onContentFocus"
            />
          </v-col>
          <v-col>
            <p class="viewer-label">Viewer</p>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="$md.render(content)"></div>
          </v-col>
        </v-row>

        <v-checkbox v-model="expose" label="公開しますか？" />
        <v-btn
          width="100%"
          class="submit-button"
          color="primary"
          @click="submit"
          >登録</v-btn
        >
      </v-card>
    </v-container>
    <Loading :open="loading" />
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Vue from 'vue'
import { ErrorResponse } from '../../apis/ErrorResponse'
import { registerPost } from '../../apis/postApi'
import Heading from '../../components/atoms/Heading.vue'
import Loading from '../../components/atoms/Loading.vue'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'

interface Data {
  title: string
  content: string
  expose: boolean
  titleErrorMessage: string
  contentErrorMessage: string
  loading: boolean
}

export default Vue.extend({
  components: { Heading, Loading },
  data(): Data {
    return {
      title: '',
      content: '',
      expose: false,
      titleErrorMessage: '',
      contentErrorMessage: '',
      loading: false,
    }
  },
  mounted() {
    if (appStore.accessToken === '') {
      this.$router.push('/auth/login')
    }
  },
  methods: {
    async submit() {
      if (this.title === '' || this.content === '') {
        return
      }
      this.titleErrorMessage = ''
      this.contentErrorMessage = ''

      try {
        this.loading = true
        await registerPost(appStore.accessToken, {
          title: this.title,
          content: this.content,
          expose: this.expose,
        })
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
            this.titleErrorMessage = errorResponse.data.title ?? ''
            this.contentErrorMessage = errorResponse.data.content ?? ''
            return
          case 401:
            this.$router.push('/auth/login')
            return
          default:
            this.$router.push(
              genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError)
            )
        }
      } finally {
        this.loading = false
      }
    },
    onTitleFocus() {
      this.titleErrorMessage = ''
    },
    onContentFocus() {
      this.contentErrorMessage = ''
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

.viewer-label {
  color: #2c2c2c;
  white-space: pre-wrap;
  border-bottom: 1px solid gainsboro;
}
</style>
