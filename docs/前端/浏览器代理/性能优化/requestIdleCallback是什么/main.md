# requestIdleCallback 是什么

> var handle = window.requestIdleCallback(callback[, options])

## 定义

`window.requestIdleCallback()` 方法将在浏览器的空闲时段内调用的函数排队。

这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。

函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

## timeout 的使用

> 强烈建议使用 timeout 选项进行必要的工作，否则可能会在触发回调之前经过几秒钟。

根据队列的特点，下面代码应该按顺序打印：

```ts
for (let i = 0; i < 10000; i++) {
  console.log(i);
}
requestIdleCallback(() => console.log('1'));
requestIdleCallback(() => console.log('2'));
```

在空闲期间执行前，会对已经超时的 callback 提前执行

```ts
for (let i = 0; i < 10000; i++) {
  console.log(i);
}
requestIdleCallback(() => console.log('1'));
requestIdleCallback(() => console.log('2'), { timeout: 1 });
```

上面代码的打印顺序是：2，1

## 取消调用

window.cancelIdleCallback() 方法用于取消之前调用

```ts
let k = requestIdleCallback(() => console.log('1'));
for (let i = 0; i < 10000; i++) {
  console.log(i);
  if (i === 5000) {
    cancelIdleCallback(k);
  }
}
requestIdleCallback(() => console.log('2'));
```

在主线程执行过程中取消了第一个 callback 注册执行，最后只会打印 2

## 参考资源

- [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)
