import fs from "fs";
import path from "path";
// import shell from "shelljs";

const cwd = process.cwd();

const PathsMap = {
  docs: path.join(cwd, "docs"),
  config: path.join(cwd, "docs/.vuepress/config.js"),
};

const NamesMap = {};

interface TreeNode extends path.ParsedPath {
  children: TreeNode[];
}

const load = (
  filePath,
  treeNode: TreeNode = { ...path.parse(filePath), children: [] }
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
  return str.replace(other, "");
};

const parse = (
  treeNode: TreeNode,
  result: ParsedTreeNode = { title: "", children: [] }
): ParsedTreeNode => {
  result.title = treeNode.name;
  result.children = treeNode.children
    .map((child) => {
      if (child.name.startsWith(".")) {
        return;
      }
      if (child.children.some((item) => item.name === "main")) {
        return trimPath(
          path.join(child.dir, child.name, "main"),
          PathsMap.docs
        );
      }
      if (child.children.length) {
        return parse(child);
      }
      if (child.ext !== ".md") {
        return;
      }

      const name = child.name === "README" ? "/" : child.name;

      return trimPath(path.join(child.dir, name), PathsMap.docs);
    })
    .filter(Boolean);

  return result;
};

const generate = (parsedTree: ParsedTreeNode) => {
  const navContent = parsedTree.children
    .map((item) => {
      if (typeof item === "string") return;
      const [readme] = item.children;
      return {
        text: item.title,
        link: readme,
      };
    })
    .filter(Boolean);

  const sidebarContent = parsedTree.children
    .map((item) => {
      if (typeof item === "string") return;
      const [readme, ...others] = item.children;
      if (typeof readme !== "string") {
        throw new Error(`${item.title} 必须有一个 README.md`);
      }
      return {
        [readme]: others,
      };
    })
    .filter(Boolean)
    .reduce((a, b) => ({ ...a, ...b }));

  let content = fs.readFileSync(PathsMap.config, { encoding: "utf8" });
  content = content.replace(
    /\/\/ generate-sidebar-start(\n|.)*\/\/ generate-sidebar-end/,
    () => {
      return `// generate-sidebar-start
    sidebar: ${JSON.stringify(sidebarContent)},
    // generate-sidebar-end`;
    }
  );
  content = content.replace(
    /\/\/ generate-nav-start(\n|.)*\/\/ generate-nav-end/,
    () => {
      return `// generate-nav-start
    nav: ${JSON.stringify(navContent)},
    // generate-nav-end`;
    }
  );
  fs.writeFileSync(PathsMap.config, content);
};

const tree = load(PathsMap.docs);
fs.writeFileSync("./tree.json", JSON.stringify(tree));
const parsedTree = parse(tree);
fs.writeFileSync("./parsedTree.json", JSON.stringify(parsedTree));
generate(parsedTree);
