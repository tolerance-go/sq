require('dotenv').config();

module.exports = {
  title: 'SQ',
  description: 'Build your own knowledge system with structured problems',
  themeConfig: {
    sidebarDepth: 6,
    repo: 'tolerance-go/sq',
    lastUpdated: true,
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '邀请前来纠正和完善此内容',
    nav: require('./nav'),
    sidebar: require('./sidebar'),
  },
  extraWatchFiles: [
    '.vuepress/nav.json',
    '.vuepress/sidebar.json',
  ],
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    process.env.VUEPRESS
      ? [
          '@vssue/vuepress-plugin-vssue',
          {
            platform: 'github-v4',
            owner: 'tolerance-go',
            repo: 'sq',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
          },
        ]
      : null,
  ].filter(Boolean),
};
