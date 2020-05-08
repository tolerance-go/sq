# webpack-chain 如何配置 rule.oneOf

## 示例代码

```ts
config.module
  .rule('images')
  .oneOf('inline')
  .resourceQuery(/inline/)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 10000,
    name: 'assets/img/[name].[hash:8].[ext]',
  })
  .end()
  .end()
  .oneOf('external')
  .resourceQuery(/external/)
  .use('file-loader')
  .loader('file-loader')
  .end()
  .use('image-webpack-loader')
  .loader('image-webpack-loader');
```

oneOf 会从上到下，匹配到任意一个即停止继续匹配，应该设置一个默认匹配
