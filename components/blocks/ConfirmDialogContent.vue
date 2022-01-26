<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>{{ message }}</v-card-text>
    <v-card-actions>
      <v-btn text color="danger" @click="onAgree">{{ agreeText }}</v-btn>
      <v-btn text color="info" @click="onCancel">{{ cancelText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    agreeText: {
      type: String,
      default: 'はい',
    },
    cancelText: {
      type: String,
      default: 'キャンセル',
    },
    onAgree: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onCancel: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
})
</script>
