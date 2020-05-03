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
    // generate-nav-start
    nav: [{"text":"前端","link":"/前端/"},{"text":"数据结构和算法","link":"/数据结构和算法/"}],
    // generate-nav-end
    // generate-sidebar-start
    sidebar: {"/前端/":[{"title":"浏览器代理","children":["/前端/浏览器代理/浏览器事件循环机制是什么/main","/前端/浏览器代理/浏览器事件机制是什么/main","/前端/浏览器代理/浏览器内核有哪些分类/main","/前端/浏览器代理/浏览器有哪些进程和线程/main","/前端/浏览器代理/浏览器渲染页面的过程是什么/main","/前端/浏览器代理/浏览器跨域机制是什么/main"]}],"/数据结构和算法/":[{"title":"动态规划","children":["/数据结构和算法/动态规划/编辑距离/main"]}]},
    // generate-sidebar-end
  },
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
