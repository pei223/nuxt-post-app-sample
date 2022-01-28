<template>
  <div>
    <v-container>
      <Heading title="記事一覧" />
      <div v-if="!posts.length">記事はありません</div>
      <div v-if="posts.length">
        <div v-for="(post, i) in posts" :key="i" class="post-row">
          <PostCard
            :post="post"
            :index="i"
            :on-favorite-clicked="changeFavorite"
          />
        </div>
      </div>
      <v-pagination v-model="page" :length="totalPage" />
    </v-container>
    <v-btn color="secondary" fab class="add-btn" @click="goAddPostPage">
      <v-icon>mdi-pencil-plus</v-icon>
    </v-btn>
    <v-dialog v-model="errorDialogOpen">
      <v-card>
        <v-card-title> お気に入り登録失敗 </v-card-title>
        <v-card-text> すでにお気に入り登録済みです。 </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { Context } from '@nuxt/types'
import { getPosts } from '../../apis/postApi'
import { addFavorite, deleteFavoriteByPostId } from '../../apis/favoriteApi'
import Heading from '../../components/atoms/Heading.vue'
import PostCard from '../../components/blocks/PostCard.vue'
import { Post } from '../../domain/post'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'
import CookieService from '~/services/CookieService'

interface Data {
  posts: Post[]
  totalPage: number
  page: number
  errorDialogOpen: boolean
}

export default Vue.extend({
  components: { Heading, PostCard },
  beforeRouteUpdate(to, _from, next) {
    this.page =
      to.query.page && !isNaN(Number(to.query.page)) ? Number(to.query.page) : 1
    this.fetchPosts()
    next()
  },
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
        errorDialogOpen: false,
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
      errorDialogOpen: false,
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
    },
  },
  methods: {
    async fetchPosts() {
      // TODO asyncDataと同じような処理で冗長だが、contextと$routerが違うため共通化できない
      try {
        const res = await getPosts(appStore.accessToken, this.page)
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
    async changeFavorite(i: number, post: Post) {
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
        post.favorited
          ? await deleteFavoriteByPostId(appStore.accessToken, post.id)
          : await addFavorite(appStore.accessToken, post.id)
        const newPost = { ...this.posts[i] }
        newPost.favorited = !newPost.favorited
        this.$set(this.posts, i, newPost)
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
          case 400:
            this.errorDialogOpen = true
            return
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
