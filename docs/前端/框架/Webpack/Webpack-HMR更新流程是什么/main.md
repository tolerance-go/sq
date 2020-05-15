# Webpack-HMR 更新流程是什么

Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR 的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)

1. 实际上 `webpack-dev-server` 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，`webpack-dev-server` 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。
2. 客户端对比出差异后会向 `webpack-dev-server` 发起 Ajax 请求来获取更改内容(文件列表、hash)
3. 这样客户端就可以再借助这些信息继续向 `webpack-dev-server` 发起 jsonp 请求获取该 chunk 的增量更新。
4. 后续的部分由 HotModulePlugin 来完成，处理更新状态，选择状态保留，错误回退，同时提供了相关 API 以供开发者针对自身场景进行处理，像 react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。

## 参考资源

- [Webpack 面试整理](https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5#heading-6)
