# 如何手动实现一个防抖函数 debounce

## 定义

防抖函数 debounce 指的是某个函数在某段时间内，无论触发了多少次回调，都只执行最后一次。假如我们设置了一个等待时间 3 秒的函数，在这 3 秒内如果遇到函数调用请求就重新计时 3 秒，直至新的 3 秒内没有函数调用请求，此时执行函数，不然就以此类推重新计时。

![2019-07-24-060203](../assets/2019-07-24-060203.jpg)

## 原理

实现原理就是利用定时器，函数第一次执行时设定一个定时器，之后调用时发现已经设定过定时器就清空之前的定时器，并重新设定一个新的定时器，如果存在没有被清空的定时器，当定时器计时结束后触发函数执行。

## 实现 1

```ts
// 实现 1
// fn 是需要防抖处理的函数
// wait 是时间间隔
function debounce(fn, wait = 50) {
  // 通过闭包缓存一个定时器 id
  let timer = null;
  // 将 debounce 处理结果当作函数返回
  // 触发事件回调时执行这个返回函数
  return function (...args) {
    // 如果已经设定过定时器就清空上一次的定时器
    if (timer) clearTimeout(timer);

    // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  };
}

// DEMO
// 执行 debounce 函数返回新函数
const betterFn = debounce(() => console.log('fn 防抖执行了'), 1000);
// 停止滑动 1 秒后执行函数 () => console.log('fn 防抖执行了')
document.addEventListener('scroll', betterFn);
```

## 实现 2

上述实现方案已经可以解决大部分使用场景了，不过想要实现第一次触发回调事件就执行 fn 有点力不从心了，这时候我们来改写下 debounce 函数，加上第一次触发立即执行的功能。

<!-- prettier-ignore -->
<<< @/docs/前端/JS/模拟/如何手动实现一个防抖函数debounce/tes/debounce.js

实现原理比较简单，判断传入的 immediate 是否为 true，另外需要额外判断是否是第一次执行防抖函数。

## 参考资源

- [深入浅出防抖函数 debounce](https://muyiy.cn/blog/7/7.2.html)
