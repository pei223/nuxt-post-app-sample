<template>
  <v-card class="card" @click="goPostDetailPage">
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
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import { convertCreatedAtForDisplay } from '../../services/convertUtil'
import { Post } from '../../domain/post'

export default Vue.extend({
  props: {
    post: {
      type: Object as PropType<Post>,
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
