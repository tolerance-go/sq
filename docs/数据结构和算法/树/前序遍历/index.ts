const preorderTraversal = (root) => {
  const stack = [];
  const output = [];
  if (root == null) {
    return output;
  }

  stack.push(root);
  while (stack.length) {
    const node = stack.pop();
    output.push(node.val);
    if (node.right != null) {
      stack.push(node.right);
    }
    if (node.left != null) {
      stack.push(node.left);
    }
  }
  return output;
};

export default preorderTraversal;
