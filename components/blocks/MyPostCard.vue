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
        <v-btn icon @click.stop="onDeleteClicked(post)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import { convertToFormatDateStr } from '../../services/convertUtil'
import { Post } from '../../domain/post'

export default Vue.extend({
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
    onDeleteClicked: {
      type: Object as PropType<(post: Post) => void>,
      required: true,
    },
  },
  computed: {
    createdAt(): string {
      return convertToFormatDateStr(this.post.createdAt)
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
  color: #2c2c2c;
  font-size: 1.1rem;
}

.post-created-at {
  color: #2c2c2c;
  font-size: 0.8rem;
}
</style>
