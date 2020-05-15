# requestAnimationFrame 是什么

> window.requestAnimationFrame(callback);

## 作用

window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

## 调用时机

当你准备更新动画时你应该调用此方法。这将使浏览器在下一次**重绘之前**调用你传入给该方法的动画函数(即你的回调函数)。

## 回调参数

回调函数会被传入 DOMHighResTimeStamp 参数，DOMHighResTimeStamp 指示当前被 requestAnimationFrame() 排序的回调函数被触发的时间。在同一个帧中的多个回调函数，它们每一个都会接受到一个相同的时间戳，即使在计算上一个回调函数的工作负载期间已经消耗了一些时间。该时间戳是一个十进制数，单位毫秒，最小精度为 1ms(1000μs)。

## 触发频率

回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。为了提高性能和电池寿命，因此在大多数浏览器里，当 requestAnimationFrame() 运行在后台标签页或者隐藏的`<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命。

> 若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 window.requestAnimationFrame()

## 示例代码

```ts
var start = null;
var element = document.getElementById('SomeElementYouWantToAnimate');
element.style.position = 'absolute';

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```

1. 通过判断参数 timestamp，如果一次更新超过 2s 中，则不再继续循环
2. 在一次回调中继续调用 `window.requestAnimationFrame(step);` 实现循环

## 取消调用

它会返回一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。

## 参考资源

- [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
