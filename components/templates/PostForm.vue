<template>
  <div>
    <v-container>
      <v-card class="card">
        <v-card-title><Heading :title="headingTitle" /></v-card-title>

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
        >
          {{ buttonText }}</v-btn
        >
      </v-card>
    </v-container>
    <Loading :open="loading" />
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Vue from 'vue'
import type { PropType } from 'vue'
import { ErrorResponse } from '../../apis/ErrorResponse'
import { PostBody, registerPost, updatePost } from '../../apis/postApi'
import Heading from '../../components/atoms/Heading.vue'
import Loading from '../../components/atoms/Loading.vue'
import { Post } from '../../domain/post'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'
import CookieService from '~/services/CookieService'

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
  props: {
    edit: {
      type: Boolean,
      required: true,
    },
    post: {
      type: Object as PropType<Post | null>,
      required: false,
      default: null,
    },
  },
  data(): Data {
    return {
      title: this.post ? this.post.title : '',
      content: this.post ? this.post.content : '',
      expose: this.post ? this.post.expose : false,
      titleErrorMessage: '',
      contentErrorMessage: '',
      loading: false,
    }
  },
  computed: {
    headingTitle(): string {
      return this.edit ? '記事編集' : '記事作成'
    },
    buttonText(): string {
      return this.edit ? '更新' : '登録'
    },
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
        const body: PostBody = {
          title: this.title,
          content: this.content,
          expose: this.expose,
        }
        if (this.post) {
          await updatePost(appStore.accessToken, this.post.id, body)
        } else {
          await registerPost(appStore.accessToken, body)
        }
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
            appStore.clear(new CookieService())
            this.$router.push('/auth/login')
            return
          case 404:
            this.$router.push('/404')
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
