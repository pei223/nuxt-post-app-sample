<template>
  <div>
    <PostForm v-if="post" :edit="true" :post="post" />
    <Loading :open="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Loading from '../../../components/atoms/Loading.vue'
import PostForm from '../../../components/templates/PostForm.vue'
import { appStore } from '~/store'
import { MyPost } from '~/domain/post'
import { findPost } from '~/apis/postApi'
import { ERROR_CODE, genErrorPath } from '~/domain/error'
import CookieService from '~/services/CookieService'

interface Data {
  post: MyPost | null
  loading: boolean
}

export default Vue.extend({
  components: { PostForm, Loading },

  data(): Data {
    return {
      post: null,
      loading: false,
    }
  },
  head() {
    return {
      title: '記事編集',
    }
  },
  async mounted() {
    if (appStore.accessToken === '') {
      this.$router.push({
        path: '/auth/login',
        query: {
          redirectUrl: this.$route.path,
        },
      })
      return
    }
    try {
      const postId = Number(this.$route.params.id)
      if (isNaN(postId)) {
        this.$router.push(genErrorPath(this.$route.path, ERROR_CODE.paramError))
        return
      }
      const post = await findPost(appStore.accessToken, postId)
      this.post = post
      this.loading = false
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
      switch (e.response.status) {
        case 401:
          appStore.clear(new CookieService())
          this.$router.push({
            path: '/auth/login',
            query: {
              redirectUrl: this.$route.path,
            },
          })
          return
        case 404:
          this.$router.push('/404')
          return
        default:
          this.$router.push(
            genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError)
          )
      }
    }
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
