// 实现 2
// immediate 表示第一次是否立即执行
function debounce(fn, wait = 50, immediate) {
  let timer = null;
  let first = true;
  return function (...args) {
    if (timer) clearTimeout(timer);

    // immediate 为 true 表示第一次触发后执行
    if (immediate && first) {
      fn.apply(this, args);
      first = false;
      return;
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  };
}

// DEMO
// 执行 debounce 函数返回新函数
const betterFn = debounce(() => console.log('fn 防抖执行了'), 1000, true);

// 第一次触发 scroll 执行一次 fn，后续只有在停止滑动 1 秒后才执行函数 fn
setInterval(betterFn, 200);
