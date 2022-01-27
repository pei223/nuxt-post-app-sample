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
      <v-pagination v-model="page" :length="totalPage" />
    </v-container>
    <v-btn color="secondary" fab class="add-btn" @click="goAddPostPage">
      <v-icon>mdi-pencil-plus</v-icon>
    </v-btn>
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
  page: number
}

export default Vue.extend({
  components: { Heading, PostCard },
  async asyncData(context: Context): Promise<Data> {
    const page =
      context.query.page && !isNaN(Number(context.query.page))
        ? Number(context.query.page)
        : 1
    try {
      const res = await getPosts(appStore.accessToken, page)
      return {
        posts: res.posts,
        totalPage: res.totalPage,
        page,
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
  data(): Data {
    // NOTE asyncDataの方が優先度高いためてきとーな値にしている
    return {
      posts: [],
      totalPage: 1,
      page: 1,
    }
  },
  head() {
    return {
      title: '記事一覧',
    }
  },
  watch: {
    page(value: string) {
      this.$router.push({
        query: {
          page: value,
        },
      })
      this.fetchPosts(Number(value))
    },
  },
  methods: {
    async fetchPosts(page: number) {
      // TODO asyncDataと同じような処理で冗長だが、contextと$routerが違うため共通化できない
      try {
        const res = await getPosts(appStore.accessToken, page)
        this.posts = res.posts
        this.totalPage = res.totalPage
      } catch (e) {
        if (!axios.isAxiosError(e)) {
          this.$router.push(genErrorPath('/posts', ERROR_CODE.notAxiosError))
          return {} as Data
        }
        if (!e.response) {
          this.$router.push(genErrorPath('/posts', ERROR_CODE.networkError))
          return
        }
        switch (e.response.status) {
          default:
            this.$router.push(
              genErrorPath('/posts', ERROR_CODE.unexpectedApiError)
            )
        }
      }
    },
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
