<template>
  <v-card class="card" @click="onPostClick">
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
import Vue from 'vue'
import { convertToFormatDateStr } from '../../services/convertUtil'
import { Post } from '../../domain/post'

export default Vue.extend({
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
  computed: {
    createdAt(): string {
      return convertToFormatDateStr(this.post.createdAt)
    },
  },
  methods: {
    onPostClick() {
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
  color: #2c2c2c;
  font-size: 1.1rem;
}

.post-created-at {
  color: #2c2c2c;
  font-size: 0.8rem;
}
</style>
