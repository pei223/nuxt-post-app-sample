<template>
  <div>
    <v-container>
      <Heading title="お気に入り記事一覧" />
      <div v-if="!favorites.length && !loading">
        お気に入り登録した記事はありません
      </div>
      <div v-if="favorites.length">
        <div v-for="(favorite, i) in favorites" :key="i" class="favorite-row">
          <FavoriteCard
            :favorite="favorite"
            :index="i"
            :on-delete-clicked="deleteFavorite"
          />
        </div>
      </div>
      <v-pagination v-model="page" :length="totalPage" />
    </v-container>
    <Loading :open="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Heading from '../components/atoms/Heading.vue'
import Loading from '../components/atoms/Loading.vue'
import FavoriteCard from '../components/blocks/FavoriteCard.vue'
import { appStore } from '~/store'
import { ERROR_CODE, genErrorPath } from '~/domain/error'
import CookieService from '~/services/CookieService'
import { Favorite } from '~/domain/Favorite'
import { deleteFavoriteByFavoriteId, getFavorites } from '~/apis/favoriteApi'

interface Data {
  loading: boolean
  favorites: Favorite[]
  totalPage: number
  page: number
}

export default Vue.extend<Data, any, unknown>({
  components: { Heading, Loading, FavoriteCard },
  beforeRouteUpdate(to, _from, next) {
    this.page =
      to.query.page && !isNaN(Number(to.query.page)) ? Number(to.query.page) : 1
    this.fetchFavorites()
    next()
  },
  data(): Data {
    const page =
      this.$route.query.page && !isNaN(Number(this.$route.query.page))
        ? Number(this.$route.query.page)
        : 1
    return {
      loading: true,
      favorites: [],
      totalPage: 1,
      page,
    }
  },
  head() {
    return {
      title: 'お気に入り記事',
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
  mounted() {
    this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      if (appStore.accessToken === '') {
        this.$router.push('/auth/login')
        return
      }
      try {
        const res = await getFavorites(appStore.accessToken, this.page)
        this.favorites = res.favorites
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
            appStore.clear(new CookieService())
            this.$router.push('/auth/login')
            return
          default:
            this.$router.push(
              genErrorPath(this.$route.path, ERROR_CODE.unexpectedApiError)
            )
        }
      }
    },
    async deleteFavorite(index: number, favorite: Favorite) {
      try {
        this.loading = true
        await deleteFavoriteByFavoriteId(appStore.accessToken, favorite.id)
        this.loading = false
        this.favorites.splice(index, 1)
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
            this.$router.push(
              genErrorPath(this.$route.path, ERROR_CODE.paramError)
            )
            break
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
  },
})
</script>

<style scoped>
.favorite-row {
  margin-bottom: 20px;
}

.add-btn {
  position: fixed;
  right: 60px;
  bottom: 60px;
}
</style>
