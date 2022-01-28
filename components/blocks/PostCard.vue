<template>
  <v-card class="card" @click="goPostDetailPage">
    <v-row>
      <v-col sm="11">
        <v-row>
          <h3 class="post-title">
            {{ post.title }}
          </h3>
        </v-row>
        <v-row>
          <p class="post-author">
            {{ post.author.name }}
          </p>
        </v-row>
        <v-row>
          <p class="post-created-at">
            {{ createdAt }}
          </p>
        </v-row>
      </v-col>
      <v-col sm="1">
        <v-btn icon @click.stop="_onFavoriteClicked">
          <v-icon v-if="post.favorited">mdi-heart</v-icon>
          <v-icon v-else>mdi-heart-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import { convertCreatedAtForDisplay } from '../../services/convertUtil'
import { Post } from '../../domain/post'

export default Vue.extend({
  props: {
    index: {
      type: Number,
      required: true,
    },
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
    onFavoriteClicked: {
      type: Function as PropType<(i: number, post: Post) => void>,
      required: true,
    },
  },
  computed: {
    createdAt(): string {
      return convertCreatedAtForDisplay(this.post.createdAt)
    },
  },
  methods: {
    goPostDetailPage() {
      this.$router.push(`/posts/${this.post.id}`)
    },
    _onFavoriteClicked() {
      this.onFavoriteClicked(this.index, this.post)
    },
  },
})
</script>

<style scoped>
.card {
  padding: 30px;
}

.post-title {
  font-weight: 600;
  font-size: 1.4rem;
}

.post-author {
  color: #7c7c7c;
  font-size: 1rem;
}

.post-created-at {
  color: #7c7c7c;
  font-size: 0.8rem;
}
</style>
