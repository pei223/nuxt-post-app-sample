<template>
  <div>
    <v-container>
      <Heading title="記事一覧" />
      <div v-if="!posts.length">記事はありません</div>
      <div v-if="posts.length">
        <div v-for="(post, i) in posts" :key="i" class="post-row">
          <PostCard :post="post" />
        </div>
      </div>
      <v-btn color="secondary" fab class="add-btn" @click="goAddPostPage">
        <v-icon>mdi-pencil-plus</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { Context } from '@nuxt/types'
import { getPosts } from '../../apis/postApi'
import Heading from '../../components/atoms/Heading.vue'
import PostCard from '../../components/blocks/PostCard.vue'
import { Post } from '../../domain/post'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'

interface Data {
  posts: Post[]
  totalPage: number
}

export default Vue.extend({
  components: { Heading, PostCard },
  async asyncData(context: Context): Promise<Data> {
    try {
      const res = await getPosts(appStore.accessToken, 1)
      return {
        posts: res.posts,
        totalPage: res.totalPage,
      }
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        context.redirect(genErrorPath('/posts', ERROR_CODE.notAxiosError))
        return {} as Data
      }
      if (!e.response) {
        context.redirect(genErrorPath('/posts', ERROR_CODE.networkError))
        return {} as Data
      }
      switch (e.response.status) {
        default:
          context.redirect(
            genErrorPath('/posts', ERROR_CODE.unexpectedApiError)
          )
      }
      return {} as Data
    }
  },
  head() {
    return {
      title: '記事一覧',
    }
  },
  methods: {
    goAddPostPage() {
      if (this.isLogined()) {
        this.$router.push('/posts/add')
      } else {
        this.$router.push({
          path: '/auth/login',
          query: {
            redirectUrl: '/posts/add',
          },
        })
      }
    },
    isLogined() {
      return appStore.accessToken !== ''
    },
  },
})
</script>

<style scoped>
.post-row {
  margin-bottom: 20px;
}

.add-btn {
  position: fixed;
  right: 60px;
  bottom: 60px;
}
</style>
