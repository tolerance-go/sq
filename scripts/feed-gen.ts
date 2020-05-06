/**
 * 距离上次发布中间的所有新文章都将作为 rss 内容
 */

import axios from 'axios';
import { Feed } from 'feed';
import fs from 'fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import path from 'path';
import shell from 'shelljs';
import { trimPath } from './utils';

const gitlog = require('gitlog').default;

const cwd = process.cwd();

const PathsMap = {
  rss: path.join(cwd, 'docs/.vuepress/public/rss.xml'),
  atom: path.join(cwd, 'docs/.vuepress/public/feed.atom'),
  json: path.join(cwd, 'docs/.vuepress/public/feed.json'),
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
    var regex = /commit\s(.*)\s\(tag:.*\)/gi;
    const result = regex.exec(decorations);
    if (result) {
      hash = result[1];
      break;
    }
  }

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
  }

  const sinceCommits = commits.slice(0, index);

  const allChangedFiles = new Set();

  sinceCommits.forEach((item) =>
    item.files.forEach((file) => allChangedFiles.add(file)),
  );

  const allChangedMd = Array.from(allChangedFiles.values())
    .filter((pathItem: string) => {
      return pathItem.startsWith('docs') && pathItem.endsWith('.md');
    })
    .map((pathItem: string) => path.join(cwd, pathItem))
    .filter((pathStr) => {
      try {
        const stat = fs.statSync(pathStr);
        return true;
      } catch {
        // 历史 commit 操作的文件可能被修改所以不存在了
        return false;
      }
    });

  return allChangedMd;
};

// 如果不清除 commit 的前提下，我选择使用 github 的算法来获取文件的贡献者，可能某刻 commit 会超多的吧，嘿嘿
const getFileContributors = (resoucePath) => {
  const authors = [];
  const consumedAuthors = {};
  return axios
    .get(
      `https://api.github.com/repos/tolerance-go/sq/commits?path=${encodeURI(
        resoucePath,
      )}`,
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

const generateFeedConfig = async (allChangedMd) => {
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
    .filter((meta) => meta.options);

  const fileContributors: { [key: string]: any } = await Promise.all(
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

  const md = new MarkdownIt();

  allFeedChangedMd.forEach(({ pathStr, options, content }) => {
    console.log('RSS 生成文章：', pathStr);

    const stat = fs.statSync(pathStr);

    const contributors = fileContributorsMapResoucePath[trimPath(pathStr, cwd)];

    const author = contributors[0];

    const getAuthor = (githubAuthor) => ({
      name: githubAuthor.login,
      email: githubAuthor.email,
      link: githubAuthor.html_url,
    });

    const [__, title] = content.match(/#\s?(.*)\n/);

    // 放到插件的 generated 生命周期里面，生成的 html 依赖样式，无法作用一般 rss 阅读器
    // const renderedFilePath = renderedPagePaths.find((item) => {
    //   return (
    //     changePath(trimPath(pathStr, PathsMap.docs), (info) => {
    //       if (info.name === 'README') {
    //         return { base: 'index.html' };
    //       }
    //       return { base: 'main.html' };
    //     }) === trimPath(item, PathsMap.outDir)
    //   );
    // });

    // const renderedFileContent = fs.readFileSync(renderedFilePath, {
    //   encoding: 'utf8',
    // });

    const renderedFileContent = md.render(content);

    feed.addItem({
      title: title,
      id: title,
      link: `${HOST}${trimPath(
        pathStr.replace('README.md', '').replace('.md', '.html'),
        PathsMap.docs,
      )}`,
      content: renderedFileContent,
      description: content.slice(0, 50),
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
generateFeedConfig(allChangedMd);
