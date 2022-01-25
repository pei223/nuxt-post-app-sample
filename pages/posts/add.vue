<template>
  <div>
    <PostForm :edit="false" />
    <Loading :open="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Loading from '../../components/atoms/Loading.vue'
import PostForm from '../../components/templates/PostForm.vue'
import { appStore } from '~/store'

interface Data {
  loading: boolean
}

export default Vue.extend({
  components: { PostForm, Loading },
  data(): Data {
    return {
      loading: false,
    }
  },
  mounted() {
    if (appStore.accessToken === '') {
      this.$router.push('/auth/login')
    }
  },
})
</script>

<style scoped>
.submit-button {
  margin-top: 40px;
}
.card {
  padding: 30px;
}

.viewer-label {
  color: #2c2c2c;
  white-space: pre-wrap;
  border-bottom: 1px solid gainsboro;
}
</style>
