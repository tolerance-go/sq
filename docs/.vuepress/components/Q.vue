<template>
  <p v-bind:class="[hidden ? 'hidden' : '', 'paper']" v-on:click="switchHidden">
    <span><slot></slot></span>
  </p>
</template>
<script>
import './Q.styl';

export default {
  data() {
    return {
      hidden: true,
    };
  },
  methods: {
    switchHidden() {
      if (this.hidden) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    },
  },
};
</script>
