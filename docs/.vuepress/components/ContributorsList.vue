<template>
  <div class="contributor-list">
    <span class="title">编辑者们：</span>
    <a v-for="item in contributors" :key="item.id" :href="item.html_url" target="_blank"
      ><img class="avatar" :src="item.avatar_url + '&s=32'"
    /></a>
  </div>
</template>
<script>
import 'whatwg-fetch';
import './ContributorsList.styl';
import getFileContributors from 'file-contributors';

export default {
  props: ['relative'],
  data() {
    return {
      contributors: null,
    };
  },
  async mounted() {
    const file = {
      owner: 'tolerance-go',
      repo: 'sq',
      path: [
        'docs',
        ...this.$page.path.split('/').slice(1, -1),
        this.relative || 'main.md',
      ].join('/'),
    };

    const contributors = await getFileContributors(
      file.owner,
      file.repo,
      file.path,
    );

    this.contributors = contributors;
  },
};
</script>
