<template>
  <div>
    <v-container>
      <Heading title="作成した記事一覧" />
      <div v-if="!posts.length && !loading">作成した記事はありません</div>
      <div v-if="posts.length">
        <div v-for="(post, i) in posts" :key="i" class="post-row">
          <PostCard :post="post" :on-delete-clicked="confirmDeletePost" />
        </div>
      </div>
      <v-btn color="secondary" fab class="add-btn" @click="goAddPostPage">
        <v-icon>mdi-pencil-plus</v-icon>
      </v-btn>
      <Loading :open="loading" />
    </v-container>
    <v-dialog v-if="targetPostToDelete" v-model="targetPostToDelete">
      <v-card>
        <v-card-title> 削除確認 </v-card-title>
        <v-card-text>
          記事: {{ targetPostToDelete.title }}を削除しますか？</v-card-text
        >
        <v-card-actions>
          <v-btn text color="danger" @click="deletePost"> 削除します </v-btn>
          <v-btn text color="info" @click="cancelDeletingPost">
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { deletePost, getMyPosts } from '../../apis/postApi'
import Heading from '../../components/atoms/Heading.vue'
import Loading from '../../components/atoms/Loading.vue'
import PostCard from '../../components/blocks/MyPostCard.vue'
import { Post } from '../../domain/post'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'

interface Data {
  loading: boolean
  posts: Post[]
  totalPage: number
  targetPostToDelete: Post | null
}

export default Vue.extend({
  components: { Heading, Loading, PostCard },
  data(): Data {
    return {
      loading: true,
      posts: [],
      totalPage: 1,
      targetPostToDelete: null,
    }
  },
  head() {
    return {
      title: '自分の記事',
    }
  },
  mounted() {
    this.fetchPosts()
  },
  methods: {
    goAddPostPage() {
      this.$router.push('/posts/add')
    },
    confirmDeletePost(post: Post): boolean {
      this.targetPostToDelete = post
      return true
    },
    async fetchPosts() {
      if (appStore.accessToken === '') {
        this.$router.push('/auth/login')
        return
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
    async deletePost() {
      if (this.targetPostToDelete === null) {
        return
      }
      try {
        this.loading = true
        await deletePost(appStore.accessToken, this.targetPostToDelete.id)
        this.loading = false
        this.targetPostToDelete = null
        this.fetchPosts()
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
    cancelDeletingPost() {
      this.targetPostToDelete = null
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
