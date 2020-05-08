/**
 * 距离上次发布中间的所有新文章都将作为 rss 内容
 *
 * 放到插件的 generated 生命周期里面，生成的 html 依赖样式，无法作用一般 rss 阅读器
 *
 */
const axios = require('axios');
const { Feed } = require('feed');
const fs = require('fs');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const path = require('path');
const shell = require('shelljs');
const { trimPath, changePath } = require('./utils');

module.exports = (options, ctx) => {
  return {
    name: 'feed-gen',
    // 为了获取加工后的图片地址
    generated(renderedPagePaths) {
      const gitlog = require('gitlog').default;

      const cwd = process.cwd();

      const PathsMap = {
        rss: path.join(ctx.outDir, 'rss.xml'),
        atom: path.join(ctx.outDir, 'feed.atom'),
        json: path.join(ctx.outDir, 'feed.json'),
        docs: path.join(cwd, 'docs'),
      };

      const HOST =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080'
          : 'http://47.92.70.143';

      const filterSinceLatestVersionCommitFiles = () => {
        const logs = shell.exec('git log --decorate --no-color').stdout;

        let hash;
        for (const decorations of logs.split('\n')) {
          // commit 18ccf21ca46efb619e6a3f73f668c49eecdb0a8b (tag: v0.1.0)
          // commit b3d96fd95e15e526e778d339a844ae1e6753cfbc (HEAD -> master, tag: v0.2.0, origin/master)
          var regex = /commit\s(.*?)\s.*?tag:.*/gi;
          const result = regex.exec(decorations);
          if (result) {
            hash = result[1];
            break;
          }
        }

        if (!hash) throw new Error('没有找到最近的版本号');
        console.log('找到最近版本号记录 hash：', hash);

        let step = 1000;
        let index = -1;
        let count = 1;
        let commits;

        while (index === -1) {
          const options = {
            repo: '.',
            number: step * count++,
            fields: ['hash', 'subject', 'authorDate', 'committerDate'],
            encoding: 'utf8',
            execOptions: { maxBuffer: 1000 * 1024 },
          };

          commits = gitlog(options);
          index = commits.findIndex((item) => item.hash === hash);

          console.log(
            'hash匹配结果：',
            'index',
            index,
            'commits length',
            commits.length,
          );
        }

        // rss 生成包括最近版本号本身
        const sinceCommits = commits.slice(0, index + 1);

        console.log('距离上个版本的 commit 集合：', sinceCommits.length);

        const allChangedFiles = new Set();

        sinceCommits.forEach((item) =>
          item.files.forEach((file) => allChangedFiles.add(file)),
        );

        const allChangedMd = Array.from(allChangedFiles.values())
          .filter((pathItem) => {
            return pathItem.startsWith('docs') && pathItem.endsWith('.md');
          })
          .map((pathItem) => path.join(cwd, pathItem))
          .filter((pathStr) => {
            try {
              const stat = fs.statSync(pathStr);
              return true;
            } catch {
              // 历史 commit 操作的文件可能被修改所以不存在了
              return false;
            }
          });

        console.log('所有存在修改记录的 md 文件：', allChangedMd.length);

        return allChangedMd;
      };

      // 获取 Github 作者提交信息
      const getFileContributors = (resoucePath) => {
        const authors = [];
        const consumedAuthors = {};

        return axios
          .get(
            `https://api.github.com/repos/tolerance-go/sq/commits?path=${encodeURIComponent(
              resoucePath,
            )}`,
            {
              headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              },
            },
          )
          .then((response) => {
            const commits = response.data;
            commits.forEach((commit) => {
              const id = commit.author.login;
              if (consumedAuthors[id]) {
                return;
              }
              consumedAuthors[id] = true;
              authors.push({
                ...commit.author,
                email: commit.commit.author.email,
              });
            });
            return { resoucePath, authors };
          });
      };

      const generateFeedConfig = async (allChangedMd, renderedPagePaths) => {
        const feed = new Feed({
          title: 'SQ',
          description:
            '用结构化的问题建立自己的领域知识体系，不断提高认知水平和解决问题的能力',
          id: HOST,
          link: HOST,
          image: `${HOST}/tree.png`,
          favicon: `${HOST}/favicon.ico`,
          copyright: 'All rights reserved 2019, Yarnb',
          feedLinks: {
            json: `${HOST}/feed.json`,
            atom: `${HOST}/feed.atom`,
            rss: `${HOST}/rss.xml`,
          },
          author: {
            name: 'telrancer-go',
            email: 'yarnbcoder@gmail.com',
            link: 'https://github.com/tolerance-go',
          },
        });

        const getFeedOptions = (pathStr) => {
          const fileStr = fs.readFileSync(pathStr, { encoding: 'utf8' });
          const { data = {}, content } = matter(fileStr);
          const { feed: options } = data;
          return { content, options, pathStr };
        };

        const allFeedChangedMd = allChangedMd
          .map((pathStr) => getFeedOptions(pathStr))
          .filter((meta) => {
            return meta.options !== false;
          });

        const fileContributors = await Promise.all(
          allFeedChangedMd.map(({ pathStr }) =>
            getFileContributors(trimPath(pathStr, cwd)),
          ),
        );

        const fileContributorsMapResoucePath = fileContributors.reduce(
          (a, b) => ({
            ...a,
            [b.resoucePath]: b.authors,
          }),
          {},
        );

        const md = new MarkdownIt({ html: true });

        allFeedChangedMd.forEach(({ pathStr, options, content }) => {
          console.log('RSS 生成文章：', pathStr);

          const stat = fs.statSync(pathStr);

          const contributors =
            fileContributorsMapResoucePath[trimPath(pathStr, cwd)];

          const author = contributors[0];

          const getAuthor = (githubAuthor) => ({
            name: githubAuthor.login,
            email: githubAuthor.email,
            link: githubAuthor.html_url,
          });

          const [__, title] = content.match(/#\s?(.*)\n?/);

          const parsedPath = path.parse(pathStr);

          const renderedFilePath = renderedPagePaths.find((item) => {
            return (
              changePath(trimPath(pathStr, PathsMap.docs), (info) => {
                if (info.name === 'README') {
                  return { base: 'index.html' };
                }
                return { base: 'main.html' };
              }) === trimPath(item, ctx.outDir)
            );
          });

          const vuepressRenderedFileContent = fs.readFileSync(
            renderedFilePath,
            {
              encoding: 'utf8',
            },
          );

          const renderedFileContent = md.render(
            content
              .replace(/<Q>(.*)<\/Q>/gi, (match, item) => item)
              .replace(
                /<Badge.*?text=["'](.*?)["'].*?\/>/gi,
                (match, item) => `[${item}]`,
              )
              .replace(
                /<Visual.*?relative="(.*?)".*?\/>/gi,
                (match, item) =>
                  `<iframe src="${HOST}/visual${path
                    .join(parsedPath.dir, item)
                    .replace(PathsMap.docs, '')}"></iframe>`,
              )
              .replace(
                /\!\[(.*?)\]\((.*?)\)/gi,
                (match, item1) =>
                  `<img src="${HOST}${
                    vuepressRenderedFileContent.match(
                      new RegExp(`<img.*?src="(.*?)".*?alt="${item1}".*?>`),
                    )[1]
                  }" alt="${item1}" />`,
              )
              .replace(/<<<\s@(.*)\n?/gi, (match, item) => {
                const codeFileFromRoot = path.join(cwd, item);
                const content = fs.readFileSync(codeFileFromRoot, {
                  encoding: 'utf8',
                });
                return `<pre><code>${content}</code></pre>`;
              }),
          );

          feed.addItem({
            title: title,
            id: title,
            link: `${HOST}${trimPath(
              pathStr.replace('README.md', '').replace('.md', '.html'),
              PathsMap.docs,
            )}`,
            content: renderedFileContent,
            description: renderedFileContent
              .replace(/<\/?.+?\/?>/gi, '')
              .slice(0, 50),
            date: stat.mtime,
            image: author.avatar_url,
            author: [getAuthor(author)],
            contributor: contributors.slice(1).map(getAuthor),
            ...options,
          });
        });

        const rss = feed.rss2();
        const atom = feed.atom1();
        const json = feed.json1();

        // additionalPages 无法使用
        fs.writeFileSync(PathsMap.rss, rss, { encoding: 'utf8' });
        fs.writeFileSync(PathsMap.atom, atom, { encoding: 'utf8' });
        fs.writeFileSync(PathsMap.json, json, { encoding: 'utf8' });

        console.log('RSS 生成资源：', PathsMap.rss);
        console.log('RSS 生成资源：', PathsMap.atom);
        console.log('RSS 生成资源：', PathsMap.json);
      };

      const allChangedMd = filterSinceLatestVersionCommitFiles();
      generateFeedConfig(allChangedMd, renderedPagePaths);
    },
  };
};
