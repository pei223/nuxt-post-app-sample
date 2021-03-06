<template>
  <div>
    <v-container>
      <div v-if="post">
        <v-card class="card">
          <v-row>
            <v-card-title>
              <Heading :title="post.title" />
            </v-card-title>
          </v-row>

          <v-row class="actions-area" justify="space-between" align="center">
            <!-- TODO 鍵アイコン -->
            <span v-if="!post.expose">非公開</span>
            <v-btn v-if="isEditable" @click="goEditPage">編集</v-btn>
          </v-row>
          <v-divider />

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="content" v-html="$md.render(post.content)"></div>
        </v-card>
      </div>
      <Loading :open="loading" />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Heading from '../../../components/atoms/Heading.vue'
import Loading from '../../../components/atoms/Loading.vue'
import { Post } from '~/domain/post'
import { appStore } from '~/store'
import { findPost } from '~/apis/postApi'
import { ERROR_CODE, genErrorPath } from '~/domain/error'

interface Data {
  post: Post | null
  loading: boolean
}
export default Vue.extend<Data, any, unknown>({
  components: { Heading, Loading },

  data(): Data {
    return {
      post: null,
      loading: true,
    }
  },
  head() {
    return {
      title: this.post ? this.post.title : '',
    }
  },
  computed: {
    isEditable(): boolean {
      if (appStore.curretnUser === null || this.post === null) {
        return false
      }
      return this.post.author.id === appStore.curretnUser.id
    },
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
  methods: {
    goEditPage() {
      if (this.post === null) {
        return
      }
      this.$router.push(`/posts/${this.post.id}/edit`)
    },
  },
})
</script>

<style scoped>
.card {
  padding: 30px;
}
.actions-area {
  padding-left: 20px;
  margin-bottom: 20px;
}
.content {
  margin-top: 20px;
}
</style>
