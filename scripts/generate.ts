import fs from 'fs';
import path from 'path';
// import shell from "shelljs";

const cwd = process.cwd();

const PathsMap = {
  docs: path.join(cwd, 'docs'),
  config: path.join(cwd, 'docs/.vuepress/config.js'),
  nav: path.join(cwd, 'docs/.vuepress/nav.json'),
  sidebar: path.join(cwd, 'docs/.vuepress/sidebar.json'),
};

const NamesMap = {};

interface TreeNode extends path.ParsedPath {
  children: TreeNode[];
  options?: any;
}

const load = (
  filePath,
  treeNode: TreeNode = { ...path.parse(filePath), children: [] },
) => {
  const files = fs.readdirSync(filePath);
  files.forEach((file) => {
    const p = path.join(filePath, file);
    const s = fs.statSync(p);
    const info = path.parse(p);

    let options;

    if (info.ext === '.md') {
      const content = fs.readFileSync(p, { encoding: 'utf8' });
      const matches = content.match(/---\n((.|\n)*)\n---/);
      if (matches) {
        const [__, r] = matches;
        const pairs = r
          .split('\n')
          .map((item) => item.split(':').map((item) => item.trim()));
        options = pairs.reduce(
          (a, [name, value]) => ({
            ...a,
            [name]: value,
          }),
          {},
        );
      }
      // readme，main 也是对文件夹对描述
      if (info.name === 'README' || info.name === 'main') {
        treeNode.options = options;
      }
    }

    const node = { ...info, options, children: [] };

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

const trimPath = (str, other) => {
  return str.replace(other, '');
};

const parse = (
  treeNode: TreeNode,
  level = 0,
  result: ParsedTreeNode = {
    collapsable: false,
    sidebarDepth: 100,
    title: '',
    children: [],
  },
): ParsedTreeNode => {
  const sortFn = (a, b) => {
    // string type or undefined
    if (a.options?.order && b.options?.order) {
      return a.options?.order - b.options?.order;
    }
    if (a.options?.order) {
      return a.options?.order - 0;
    }
    if (b.options?.order) {
      return 0 - b.options?.order;
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

        if (child.name === 'README' && !child.options?.sidebar) {
          return;
        }

        const name = child.name === 'README' ? '/' : child.name;

        return trimPath(path.join(child.dir, name), PathsMap.docs);
      })
      .filter(Boolean),
  };
};

const injectComment = (parsedTree: ParsedTreeNode) => {
  const vssueContent = `
<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
  `;

  parsedTree.children.forEach((child) => {
    if (typeof child === 'string') {
      if (child.endsWith('/main')) {
        const p = path.join(PathsMap.docs, child) + '.md';
        let old = fs.readFileSync(p, { encoding: 'utf8' });
        let changed = false;
        if (!old.match(/<Vssue :title="\$title" \/>/)) {
          old += vssueContent;
          changed = true;
        }
        // 头部可能有 options
        if (!old.match(/^---/) && !old.match(/^#/)) {
          const arr = child.split('/');
          const name = arr[arr.length - 2];
          old = `# ${name}\n${old}`;
          changed = true;
        }
        if (changed) {
          fs.writeFileSync(p, old, {
            encoding: 'utf8',
          });
        }
      }
      return;
    }
    if (child.children.length) {
      injectComment(child);
    }
  });
};

const generate = (parsedTree: ParsedTreeNode) => {
  const navContent = parsedTree.children
    .map((item) => {
      if (typeof item === 'string') return;
      return {
        text: item.title,
        link: `/${item.title}/`,
      };
    })
    .filter(Boolean);

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
};

const tree = load(PathsMap.docs);
fs.writeFileSync('./tree.json', JSON.stringify(tree));
const parsedTree = parse(tree);
fs.writeFileSync('./parsedTree.json', JSON.stringify(parsedTree));
generate(parsedTree);
injectComment(parsedTree);
