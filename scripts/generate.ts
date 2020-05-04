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
    const node = { ...info, children: [] };

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
  children: (ParsedTreeNode | string)[];
}

const trimPath = (str, other) => {
  return str.replace(other, '');
};

const parse = (
  treeNode: TreeNode,
  result: ParsedTreeNode = { title: '', children: [] },
): ParsedTreeNode => {
  result.title = treeNode.name;
  result.children = treeNode.children
    .map((child) => {
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
        return parse(child);
      }
      if (child.ext !== '.md') {
        return;
      }

      const name = child.name === 'README' ? '/' : child.name;

      return trimPath(path.join(child.dir, name), PathsMap.docs);
    })
    .filter(Boolean);

  return result;
};

const injectComment = (parsedTree: ParsedTreeNode) => {
  const vssueContent = `
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
        if (!old.match(/^#/)) {
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
      const readmeIndex = item.children.findIndex(
        (item) => typeof item === 'string',
      );
      if (readmeIndex === -1) {
        throw new Error(`${item.title} 必须有一个 README.md`);
      }
      const readme = item.children[readmeIndex]
      return {
        text: item.title,
        link: readme,
      };
    })
    .filter(Boolean);

  const sidebarContent = parsedTree.children
    .map((item) => {
      if (typeof item === 'string') return;
      const readmeIndex = item.children.findIndex(
        (item) => typeof item === 'string',
      );

      if (readmeIndex === -1) {
        throw new Error(`${item.title} 必须有一个 README.md`);
      }
      const readme = item.children[readmeIndex] as string;
      const others = item.children.filter(
        (item, index) => readmeIndex !== index,
      );
      return {
        [readme]: others,
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
