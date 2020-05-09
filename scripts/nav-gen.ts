import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { trimPath } from './utils';

const cwd = process.cwd();

const PathsMap = {
  docs: path.join(cwd, 'docs'),
  config: path.join(cwd, 'docs/.vuepress/config.js'),
  nav: path.join(cwd, 'docs/.vuepress/nav.json'),
  sidebar: path.join(cwd, 'docs/.vuepress/sidebar.json'),
};

const HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://47.92.70.143';

interface TreeNode extends path.ParsedPath {
  children: TreeNode[];
  options?: any;
  stats?: fs.Stats;
}

const totalMap = {};

const load = (
  filePath,
  treeNode: TreeNode = { ...path.parse(filePath), stats: null, children: [] },
) => {
  const files = fs.readdirSync(filePath);
  files.forEach((file) => {
    const p = path.join(filePath, file);
    const s = fs.statSync(p);
    const info = path.parse(p);

    let options: { [key: string]: any } = {};

    if (info.ext === '.md') {
      const content = fs.readFileSync(p, { encoding: 'utf8' });

      const { data = {} } = matter(content);
      options = data;

      const matches = filePath.match(new RegExp(`${PathsMap.docs}/(.*?)/`));
      if (matches !== null) {
        if (info.name === 'README' && options.hiddenInSidebar) {
        } else {
          totalMap[matches[1]]
            ? totalMap[matches[1]]++
            : (totalMap[matches[1]] = 1);
        }
      }

      // readme，main 也是对文件夹对描述
      if (info.name === 'README' || info.name === 'main') {
        treeNode.options = options;
      }
    }

    const node = { ...info, stats: s, options, children: [] };

    if (s.isDirectory()) {
      treeNode.children.push(node);
      load(p, node);
      return;
    }

    treeNode.children.push(node);
  });
  return treeNode;
};

interface ParsedTreeNode {
  title: string;
  collapsable: boolean;
  sidebarDepth: number;
  children: (ParsedTreeNode | string)[];
}

const parse = (treeNode: TreeNode, level = 0): ParsedTreeNode => {
  const sortFn = (a, b) => {
    // string type or undefined
    if (a.options.order && b.options.order) {
      return a.options.order - b.options.order;
    }
    if (a.options.order) {
      return a.options.order - 0;
    }
    if (b.options.order) {
      return 0 - b.options.order;
    }
    return 0;
  };

  treeNode.children.sort(sortFn);

  return {
    collapsable: level > 2 ? true : false,
    sidebarDepth: 100,
    title: treeNode.name,
    children: treeNode.children
      .map((child) => {
        if (child.name.endsWith('assets')) {
          return;
        }

        if (child.name.startsWith('.')) {
          return;
        }
        if (child.children.some((item) => item.name === 'main')) {
          return trimPath(
            path.join(child.dir, child.name, 'main'),
            PathsMap.docs,
          );
        }
        if (child.children.length) {
          return parse(child, level + 1);
        }
        if (child.ext !== '.md') {
          return;
        }

        if (child.name === 'README' && child.options.hiddenInSidebar) {
          return;
        }

        const name = child.name === 'README' ? '/' : child.name;

        return trimPath(path.join(child.dir, name), PathsMap.docs);
      })
      .filter(Boolean),
  };
};

const generateSidebar = (parsedTree) => {
  const navContent = parsedTree.children
    .map((item) => {
      if (typeof item === 'string') return;
      return {
        text: item.title,
        link: `/${item.title}/`,
      };
    })
    .filter(Boolean)
    .map((item) => {
      const n = '晓问题';
      if (item.text === n) {
        return {
          ...item,
          text: `${n}(${totalMap[n]}) 🌱`,
        };
      }

      if (totalMap[item.text]) {
        return {
          ...item,
          text: `${item.text}(${totalMap[item.text]})`,
        };
      }
      return item;
    })

    .concat({
      text: 'RSS订阅',
      items: [
        { text: 'RSS 2.0', link: `${HOST}/rss.xml`, target: '_blank' },
        { text: 'Atom 1.0', link: `${HOST}/feed.atom`, target: '_blank' },
        { text: 'JSON Feed 1.0', link: `${HOST}/feed.json`, target: '_blank' },
      ],
    });

  const sidebarContent = parsedTree.children
    .map((item) => {
      if (typeof item === 'string') return;
      const readme = `/${item.title}/`;
      return {
        [readme]: item.children,
      };
    })
    .filter(Boolean)
    .reduce((a, b) => ({ ...a, ...b }));

  fs.writeFileSync(PathsMap.sidebar, JSON.stringify(sidebarContent), {
    encoding: 'utf8',
  });
  fs.writeFileSync(PathsMap.nav, JSON.stringify(navContent), {
    encoding: 'utf8',
  });

  console.log('生成 Sidebar 配置文件', PathsMap.sidebar);
  console.log('生成 Nav 配置文件', PathsMap.nav);
};

const tree = load(PathsMap.docs);
const parsedTree = parse(tree);
generateSidebar(parsedTree);
