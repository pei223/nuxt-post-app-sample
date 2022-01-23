<template>
  <v-container>
    <Heading title="作成した記事一覧" />
    <div v-if="!posts.length">作成した記事はありません</div>
    <div v-if="posts.length">
      <v-card v-for="(post, i) in posts" :key="i" class="card">
        <v-row justify="space-between" align="center" class="row">
          {{ post.title }}
          {{ post.author.name }}
        </v-row>
      </v-card>
    </div>
    <Loading :open="loading" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { Post, getMyPosts } from '../../apis/postApi'
import Heading from '../../components/atoms/Heading.vue'
import Loading from '../../components/atoms/Loading.vue'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/services/error'

interface Data {
  loading: boolean
  posts: Post[]
  totalPage: number
}

export default Vue.extend({
  components: { Heading, Loading },
  data(): Data {
    return {
      loading: true,
      posts: [],
      totalPage: 1,
    }
  },
  async mounted() {
    if (appStore.accessToken === '') {
      this.$router.push('/auth/login')
    }
    try {
      const res = await getMyPosts(appStore.accessToken, 1)
      this.posts = res.posts
      this.totalPage = res.totalPage
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
          this.$router.push('/auth/login')
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
  cursor: pointer;
  color: black;
  background-color: white;
  margin-bottom: 30px;
}

.row {
  padding: 10px 20px;
}
</style>
