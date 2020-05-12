# babel 构建的过程是什么

大多数 JavaScript Parser 遵循 estree 规范，Babel 最初基于 acorn 项目(轻量级现代 JavaScript 解析器) Babel 大概分为三大部分：

解析：将代码转换成 AST

词法分析：将代码(字符串)分割为 token 流，即语法单元成的数组语法分析：分析 token 流(上面生成的数组)并生成 AST 转换：访问 AST 的节点进行变换操作生产新的 AST

Taro 就是利用 babel 完成的小程序语法转换生成：以新的 AST 为基础生成代码

## 参考资源

- [Webpack 面试整理](https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5#heading-6)
