<template>
  <div v-if="open" class="loading-container">
    <v-progress-circular size="100" color="purple" indeterminate />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>
