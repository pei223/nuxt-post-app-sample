<template>
  <v-card class="card" @click="goPostDetailPage">
    <v-row>
      <v-col sm="11">
        <v-row>
          <h3 class="post-title">
            <span v-if="isDeleted">(削除済み)</span>
            {{ favorite.title }}
          </h3>
        </v-row>
        <v-row>
          <p class="post-author">
            {{ favorite.author }}
          </p>
        </v-row>
      </v-col>
      <v-col sm="1">
        <v-btn icon @click.stop="onDeleteClicked(index, favorite)">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import { Favorite } from '~/domain/Favorite'

export default Vue.extend({
  props: {
    index: {
      type: Number,
      required: true,
    },
    favorite: {
      type: Object as PropType<Favorite>,
      required: true,
    },
    onDeleteClicked: {
      type: Function as PropType<(i: number, favorite: Favorite) => void>,
      required: true,
    },
  },
  computed: {
    isDeleted(): boolean {
      return this.favorite.postId === -1
    },
  },
  methods: {
    goPostDetailPage() {
      if (this.isDeleted) {
        return
      }
      this.$router.push(`/posts/${this.favorite.postId}`)
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
