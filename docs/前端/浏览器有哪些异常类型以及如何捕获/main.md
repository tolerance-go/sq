# 浏览器有哪些异常类型以及如何捕获

## 类型

1. JS 语法错误、代码异常

2. AJAX 请求异常

3. 静态资源加载异常

4. Promise 异常

5. Iframe 异常

6. 跨域 Script error

7. 崩溃和卡顿

## 捕获方式

### JS 语法错误

无法捕获，应该在开发阶段解决，调试或者构建都可以发现

### JS 代码异常

#### 同步错误

try-catch

#### 异步错误

window.onerror

window.onerror 函数只有在**返回 true 的时候，异常才不会向上抛出**，否则即使是知道异常的发生控制台还是会显示 Uncaught Error: xxxxx

需要注意：

1. onerror 最好写在所有 JS 脚本的前面，否则有可能捕获不到错误；

2. onerror 无法捕获语法错误

### 静态资源加载异常

```js
window.addEventListener('error', (e) => console.log(e), true); // 捕获阶段
```

由于网络请求异常不会事件冒泡，因此必须在**捕获阶段**将其捕捉到才行，但是这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。

需要注意:

1. 不同浏览器下返回的 error 对象可能不同，需要注意兼容处理。

2. 需要注意避免 addEventListener 重复监听。

### Promise 异常

#### catch

在 promise 中使用 catch 可以非常方便的捕获到异步 error ，这个很简单。没有写 catch 的 Promise 中抛出的错误无法被 onerror 或 try-catch 捕获到，所以我们务必要在 Promise 中不要忘记写 catch 处理抛出的异常。

#### unhandledrejection

解决方案：为了防止有漏掉的 Promise 异常，建议在全局增加一个对 unhandledrejection 的监听，用来全局监听 Uncaught Promise Error。

补充一点：如果去掉控制台的异常显示，需要加上：`e.preventDefault();`

### React 异常

React 16 提供了一个内置函数 componentDidCatch，使用它可以非常简单的获取到 react 下的错误信息。

需要注意的是：error boundaries 并不会捕捉下面这些错误。

1. 事件处理器

2. 异步代码

3. 服务端的渲染代码

4. 在 error boundaries 区域外的错误

### Iframe 异常

对于 iframe 的异常捕获，我们还得借力 window.onerror：

```html
<iframe src="" frameborder="0" />
<script>
  window.frames[0].onerror = () => {
    //...
  };
</script>
```

### Script error

一般情况，如果出现 Script error 这样的错误，基本上可以确定是出现了跨域问题。这时候，是不会有其他太多辅助信息的，但是解决思路无非如下：

跨源资源共享机制( CORS )：我们为 script 标签添加 crossOrigin 属性。

特别注意，服务器端需要设置：Access-Control-Allow-Origin

浏览器对此异常信息收集会尽可能的少，利用包装 addEventListener，我们还可以达到「扩展堆栈」的效果

### 崩溃和卡顿

卡顿也就是网页暂时响应比较慢， JS 可能无法及时执行。但崩溃就不一样了，网页都崩溃了，JS 都不运行了，还有什么办法可以监控网页的崩溃，并将网页崩溃上报呢？

利用 window 对象的 **load** 和 **beforeunload** 事件实现了网页崩溃的监控。对正常退出设置一个标记量。

基于以下原因，我们可以使用 Service Worker 来实现网页崩溃的监控：

- Service Worker 有自己独立的工作线程，与网页区分开，网页崩溃了，Service Worker 一般情况下不会崩溃

- Service Worker 生命周期一般要比网页还要长，可以用来监控网页的状态

- 网页可以通过 navigator.serviceWorker.controller.postMessage API 向掌管自己的 SW 发送消息

## 错误上报

### 通过 Ajax 发送数据

因为 Ajax 请求本身也有可能会发生异常，而且有可能会引发跨域问题，一般情况下更推荐使用动态创建 img 标签的形式进行上报。

### 动态创建 img 标签的形式

动态设置 img.src

## 采集率

收集异常信息量太多，怎么办？实际中，我们不得不考虑这样一种情况：如果你的网站访问量很大，那么一个必然的错误发送的信息就有很多条，这时候，我们需要设置采集率，从而减缓服务器的压力

采集率应该通过实际情况来设定，**随机数**，或者某些**用户特征**都是不错的选择。

## 参考资源

- [如何优雅处理前端的异常？](https://mp.weixin.qq.com/s/cGv0cVOlDrLxp5PIOOTwTg)
