# 如何模拟 call 和 apply 函数

call 和 apply 都是函数原型上的方法，可以改变函数执行时 this 的指向

call 和 apply 的区别在于，call 方法接受的是若干个参数的列表，而 apply 方法接受的是一个包含多个参数的数组

```ts
var func = function(arg1, arg2) {
     ...
};

func.call(this, arg1, arg2); // 使用 call，参数列表
func.apply(this, [arg1, arg2]) // 使用 apply，参数数组
```

## call 函数主要做什么事情

1. call() 改变了 this 的指向
2. 函数 bar 执行了

## 如何模拟 call 函数

### 1. 通过隐式绑定初步实现

如果在调用 call 的时候把函数 bar 添加到 foo 对象中，即如下

```ts
var foo = {
  value: 1,
  bar: function () {
    console.log(this.value);
  },
};

foo.bar(); // 1
```

这个改动就可以实现：改变了 this 的指向并且执行了函数 bar。

但是这样写是有副作用的，即给 foo 额外添加了一个属性，怎么解决呢？

解决方法很简单，用 delete 删掉就好了。

所以只要实现下面 3 步就可以模拟实现了。

1. 将函数设置为对象的属性：foo.fn = bar
2. 执行函数：foo.fn()
3. 删除函数：delete foo.fn

### 2. 建立无副作用的函数，并且设置在函数原型链上

```ts
// 第一版
Function.prototype.call2 = function (context) {
  // 首先要获取调用call的函数，用this可以获取
  context.fn = this; // foo.fn = bar
  context.fn(); // foo.fn()
  delete context.fn; // delete foo.fn
};

// 测试一下
var foo = {
  value: 1,
};

function bar() {
  console.log(this.value);
}

bar.call2(foo); // 1
```

### 3. 接收更多参数

```ts
Function.prototype.call2 = function (context) {
  context.fn = this;
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  // 会自动调用 args.toString()
  eval('context.fn(' + args + ')');
  delete context.fn;
};
```

ES6 的写法如下：

```ts
Function.prototype.call2 = function (context) {
  context.fn = this;
  var args = [...arguments].slice(1);
  // var args = Array.from(arguments).slice(1);
  // 会自动调用 args.toString()
  eval('context.fn(' + args + ')');
  delete context.fn;
};
```

### 4. 更多功能细节

1. this 参数可以传 null 或者 undefined，此时 this 指向 window
2. this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换
3. 函数是可以有返回值的

```ts
Function.prototype.call2 = function (context) {
  context = context ? Object(context) : window; // 实现细节 1 和 2
  context.fn = this;

  var args = [...arguments].slice(1);
  var result = eval('context.fn(' + args + ')');

  delete context.fn;
  return result; // 实现细节 2
};
```

### 5. 避免覆盖属性

```ts
function fnFactory(context) {
  var unique_fn = 'fn';
  while (context.hasOwnProperty(unique_fn)) {
    unique_fn = 'fn' + Math.random(); // 循环判断并重新赋值
  }

  return unique_fn;
}

Function.prototype.call2 = function (context) {
  context = context ? Object(context) : window; // 实现细节 1 和 2
  var fn = fnFactory(context);
  context[fn] = this;

  var args = [...arguments].slice(1);
  var result = eval('context.fn(' + args + ')');

  delete context[fn];
  return result; // 实现细节 2
};
```

ES6 有一个新的基本类型 Symbol，表示独一无二的值，用法如下。

```ts
const symbol1 = Symbol();
const symbol2 = Symbol(42);
const symbol3 = Symbol('foo');

console.log(typeof symbol1); // "symbol"
console.log(symbol3.toString()); // "Symbol(foo)"
console.log(Symbol('foo') === Symbol('foo')); // false
```

PS：不能使用 new 命令，Symbol 是内置基本类型的值而不具有可调用的构造函数，不然会报错。

模拟完整代码如下：

```ts
Function.prototype.call = function (context) {
  context = context ? Object(context) : window;
  var fn = Symbol(); // added
  context[fn] = this; // changed

  let args = [...arguments].slice(1);
  let result = context[fn](...args); // changed

  delete context[fn]; // changed
  return result;
};
```

## 如果模拟 apply 函数

大致上和模拟 call 函数一样，区别在于参数类型，完整参考代码如下：

```ts
Function.prototype.apply = function (context, arr) {
  context = context ? Object(context) : window;
  var fn = Symbol(); // added
  context[fn] = this; // changed

  let result;
  if (!arr) {
    result = context.fn();
  } else {
    result = context.fn(...arr);
  }

  delete context[fn];
  return result;
};
```

## 参考资源

- [深度解析 call 和 apply 原理、使用场景及实现](https://muyiy.cn/blog/3/3.3.html#call-%E5%92%8C-apply)


