const fs = require('fs');
const envData = require('dotenv').config();

if (envData.error) {
  throw envData.error;
}

const HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://47.92.70.143';

module.exports = {
  title: 'SQ',
  description: 'Build your own knowledge system with structured problems',
  themeConfig: {
    sidebarDepth: 6,
    repo: 'tolerance-go/sq',
    lastUpdated: true,
    lastUpdated: '上次更新',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '邀请前来纠正和完善此内容',
    nav: require('./nav'),
    sidebar: require('./sidebar'),
  },
  head: [
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: `${HOST}/rss.xml`,
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        href: `${HOST}/feed.atom`,
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/json',
        href: `${HOST}/feed.json`,
      },
    ],
  ],

  extraWatchFiles: ['.vuepress/nav.json', '.vuepress/sidebar.json'],
  markdown: {
    extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'],
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    require('./plugins/feed-gen/index.js'),
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
  chainWebpack(config) {
    // RSS 需要生成后的 URL 链接提取出来
    config.module.rule('images').uses.delete('url-loader');
    config.module.rule('images').use('file-loader').loader('file-loader');

    config.plugin('injections').tap(([options]) => [
      Object.assign(
        options,
        Object.keys(envData.parsed).reduce((obj, key) => {
          return {
            ...obj,
            [`process.env.${key}`]: JSON.stringify(envData.parsed[key]),
          };
        }),
      ),
    ]);
  },
};
