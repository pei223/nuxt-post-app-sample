<template>
  <div>
    <v-container>
      <div v-if="post">
        <v-card class="card">
          <v-row justify="space-between" align="center">
            <v-card-title>
              <Heading :title="post.title" />
            </v-card-title>
            <!-- TODO 鍵アイコン -->
            <span v-if="!post.expose">非公開</span>
          </v-row>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="$md.render(post.content)"></div>
        </v-card>
      </div>
      <Loading :open="loading" />
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Heading from '../../components/atoms/Heading.vue'
import Loading from '../../components/atoms/Loading.vue'
import { Post } from '~/domain/post'
import { appStore } from '~/store'
import { findPost } from '~/apis/postApi'
import { ERROR_CODE, genErrorPath } from '~/domain/error'

interface Data {
  post: Post | null
  loading: boolean
}
export default Vue.extend({
  components: { Heading, Loading },
  data(): Data {
    return {
      post: null,
      loading: true,
    }
  },
  async mounted() {
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
.card {
  padding: 30px;
}
</style>
