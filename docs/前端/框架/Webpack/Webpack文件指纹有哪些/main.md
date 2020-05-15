# Webpack 文件指纹有哪些

文件指纹是打包后输出的文件名的后缀。

1. Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
2. Chunkhash：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
3. Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

## 参考资源

- [Webpack 面试整理](https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5#heading-6)

