<template>
  <div v-if="src" class="box">
    <iframe
      class="visual-frame"
      :src="src"
      v-bind:style="{ height: height + 'px' }"
    />
    <a :href="src" target="_blank" class="link">新窗口打开</a>
  </div>
</template>
<script>
import './Visual.styl';

export default {
  props: ['relative', 'height'],
  data() {
    return {
      src: null,
    };
  },
  mounted() {
    this.src =
      'http://' +
      [
        process.env.NODE_ENV === 'development'
          ? 'localhost:1234'
          : '47.92.70.143/visual',
        ...this.$page.path.split('/').slice(1, -1),
        this.relative,
      ].join('/');
  },
};
</script>
