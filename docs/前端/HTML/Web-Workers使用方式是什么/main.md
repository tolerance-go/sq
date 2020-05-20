# Web-Workers 使用方式是什么

## 解决的问题

Web Workers 使得一个 Web 应用程序可以在与主执行线程分离的后台线程中运行一个脚本操作。这样做的好处是可以在一个单独的线程中执行费时的处理任务，从而允许主（通常是 UI）线程运行而不被阻塞。

## 使用

### 限制

worker 线程的使用有一些注意点

1. 同源限制 worker 线程执行的脚本文件必须和主线程的脚本文件同源，这是当然的了，总不能允许 worker 线程到别人电脑上到处读文件吧文件限制 为了安全，worker 线程无法读取本地文件，它所加载的脚本必须来自网络，且需要与主线程的脚本同源

2. DOM 操作限制 worker 线程在与主线程的 window 不同的另一个全局上下文中运行，其中无法读取主线程所在网页的 DOM 对象，也不能获取 document、 window 等对象，但是可以获取 navigator、 location(只读)、XMLHttpRequest、 setTimeout 族等浏览器 API。

3. 通信限制 worker 线程与主线程不在同一个上下文，不能直接通信，需要通过 postMessage 方法来通信。

4. 脚本限制 worker 线程不能执行 alert、 confirm，但可以使用 XMLHttpRequest 对象发出 ajax 请求。

### 例子

<Visual relative="./index.html" />

<!-- prettier-ignore -->
<<< @/docs/前端/HTML/Web-Workers使用方式是什么/index.html

<!-- prettier-ignore -->
<<< @/docs/前端/HTML/Web-Workers使用方式是什么/workerThread1.js

主线程中的 api， worker 表示是 Worker 的实例：

1. worker.postMessage: 主线程往 worker 线程发消息，消息可以是任意类型数据，包括二进制数据
2. worker.terminate: 主线程关闭 worker 线程
3. worker.onmessage: 指定 worker 线程发消息时的回调，也可以通过 worker.addEventListener('message',cb)的方式
4. worker.onerror: 指定 worker 线程发生错误时的回调，也可以 worker.addEventListener('error',cb)

Worker 线程中全局对象为 self，代表子线程自身，这时 this 指向 self，其上有一些 api：

1. self.postMessage: worker 线程往主线程发消息，消息可以是任意类型数据，包括二进制数据
2. self.close: worker 线程关闭自己
3. self.onmessage: 指定主线程发 worker 线程消息时的回调，也可以 self.addEventListener('message',cb)
4. self.onerror: 指定 worker 线程发生错误时的回调，也可以 self.addEventListener('error',cb)

## 怎么在 ES6+Webpack 下使用 Web Worker

[链接](https://juejin.im/post/5acf348151882579ef4f5a77)

## 参考资源

- [前端 Web Workers 到底是什么？](https://zhuanlan.zhihu.com/p/98126032)