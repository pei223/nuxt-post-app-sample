<template>
  <h1 class="heading-title">{{ title }}</h1>
</template>

<script lant="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
  },
})
</script>

<style scoped>
.heading-title {
  font-size: 2rem;
  font-weight: 600;
}
</style>
