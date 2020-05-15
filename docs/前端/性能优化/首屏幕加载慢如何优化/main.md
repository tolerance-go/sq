# 首屏幕加载慢如何优化

## 1. 压缩资源体积

## 2. 加载顺序

首屏渲染速度除了受 js 文件大小的影响，还有 HTML 的解析时机。为了提早加载完 document，最好将没有用到的其他文件的下载往后推或者异步下载（不要让他阻塞 document 的加载）。这里给这些 js 文件添加了 defer 属性。

## 3. 路由懒加载

减少首屏资源体积

```ts
const Home = () => import(/* webpackChunkName: "home" */ '@/views/home');
const Design = () => import(/* webpackChunkName: "design" */ '@/views/design');
const HotZone = () =>
  import(/* webpackChunkName: "hot-zone" */ '@/views/hot-zone');
```

## 2. 图片懒加载

IntersectionObserver

## 3. DNS 预解析

资源预加载是另一个性能优化技术，我们可以使用该技术来预先告知浏览器某些资源可能在将来会被使用到。通过 DNS 预解析来告诉浏览器未来我们可能从某个特定的 URL 获取资源，当浏览器真正使用到该域中的某个资源时就可以尽快地完成 DNS 解析。例如，我们将来可从 example.com 获取图片或音频资源，那么可以在文档顶部的 标签中加入以下内容：

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
<link rel="dns-prefetch" href="//www.img.com" />
<link rel="dns-prefetch" href="//www.api.com" />
<link rel="dns-prefetch" href="//www.test.com" />
```

## 4. SSR 渲染

服务端渲染
