<template>
  <div class="contributor-list">
    <span class="title">贡献者们：</span>
    <a
      v-for="item in contributors"
      :key="item.id"
      :href="item.html_url"
      target="_blank"
    >
      <img class="avatar" :src="item.avatar_url + '&s=32'" />
    </a>
  </div>
</template>
<script>
import './ContributorsList.styl';
import axios from 'axios';

const getFileContributors = (owner, repo, path) => {
  const authors = [];
  const consumedAuthors = {};
  return axios
    .get(`https://api.github.com/repos/${owner}/${repo}/commits?path=${path}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .then((response) => {
      const commits = response.data;
      commits.forEach((commit) => {
        const id = commit.author.login;
        if (consumedAuthors[id]) {
          return;
        }

        consumedAuthors[id] = true;
        authors.push(commit.author);
      });
      return authors;
    });
};

const getRepoContributors = (owner, repo) => {
  return axios
    .get(`https://api.github.com/repos/${owner}/${repo}/contributors`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .then((response) => {
      const authors = response.data;
      return authors;
    });
};

export default {
  props: ['relative', 'repo'],
  data() {
    return {
      contributors: null,
    };
  },
  async mounted() {
    let contributors = [];
    const options = {
      owner: 'tolerance-go',
      repo: 'sq',
    };

    if (this.repo) {
      contributors = await getRepoContributors(options.owner, options.repo);
    } else {
      const paths = this.$page.path.split('/');
      const file = {
        path: [
          'docs',
          ...paths.slice(1, -1),
          this.relative || paths.slice(-1)[0].replace('.html', '.md'),
        ].join('/'),
      };

      contributors = await getFileContributors(
        options.owner,
        options.repo,
        file.path,
      );
    }

    this.contributors = contributors;
  },
};
</script>
