# 如何模拟 bind 函数

## bind 函数有哪些特性

1. 可以指定 this
2. 返回一个函数
3. 可以传入参数，柯里化
4. 使用 new 操作符，绑定的 this 值被忽略，同时调用时的参数被提供给构造函数
5. bind 必须被函数对象调用

## 模拟步骤

### 1. 利用显示绑定和闭包

对于第 1 点，使用 call 或者 apply 指定 this 。

对于第 2 点，使用 return 返回一个函数。

```ts
// 第一版
Function.prototype.bind2 = function (context) {
  var self = this; // this 指向调用者
  return function () {
    // 实现第 2点
    return self.apply(context); // 实现第 1 点
  };
};
```

### 2. 合并参数

对于第 3 点，使用 arguments 获取参数数组并作为 self.apply() 的第二个参数。

对于第 4 点，获取返回函数的参数，然后同第 3 点的参数合并成一个参数数组，并作为 self.apply() 的第二个参数。

```ts
// 第二版
Function.prototype.bind2 = function (context) {
  var self = this;
  // 实现第3点，因为第1个参数是指定的this,所以只截取第1个之后的参数
  // arr.slice(begin); 即 [begin, end]
  var args = Array.prototype.slice.call(arguments, 1);

  return function () {
    // 实现第4点，这时的arguments是指bind返回的函数传入的参数
    // 即 return function 的参数
    var bindArgs = Array.prototype.slice.call();
    return self.apply(context, args.concat(bindArgs));
  };
};
```

### 3. instanceof 判断是否位于构造调用中

第四点用一个例子说明一下：

```ts
var value = 2;
var foo = {
  value: 1,
};
function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'Jack');
var obj = new bindFoo(20);
// undefined
// Jack
// 20

obj.habit;
// shopping

obj.friend;
// kevin
```

上面例子中，运行结果 this.value 输出为 undefined，这不是全局 value 也不是 foo 对象中的 value，这说明 bind 的 this 对象失效了，new 的实现中生成一个新的对象，这个时候的 this 指向的是 obj。

这里可以通过修改返回函数的原型来实现，代码如下：

```ts
// 第三版
Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);

    // 注释1
    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs),
    );
  };
  // 注释2
  fBound.prototype = this.prototype;
  return fBound;
};
```

- 注释 1：

  - 当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true，可以让实例获得来自绑定函数的值，即上例中实例会具有 habit 属性。

  - 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context

- 注释 2：

  - 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值，即上例中 obj 可以获取到 bar 原型上的 friend。

### 4. 优化原型方案

上面实现中 fBound.prototype = this.prototype 有一个缺点，直接修改 fBound.prototype 的时候，也会直接修改 this.prototype。

来个代码测试下：

```ts
// 测试用例
var value = 2;
var foo = {
  value: 1,
};
function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind2(foo, 'Jack'); // bind2
var obj = new bindFoo(20); // 返回正确
// undefined
// Jack
// 20

obj.habit; // 返回正确
// shopping

obj.friend; // 返回正确
// kevin

obj.__proto__.friend = 'Kitty'; // 修改原型

bar.prototype.friend; // 返回错误，这里被修改了
// Kitty
```

解决方案是用一个空对象作为中介，把 fBound.prototype 赋值为空对象的实例（原型式继承）。

```ts
fBound.prototype = Object.create(this.prototype);
```

完整代码如下：

```ts
// 第四版，已通过测试用例
Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs),
    );
  };

  fBound.prototype = Object.create(this.prototype);
  return fBound;
};
```

### 5. 根据实例类型判断调用上下文

bind 如果调用上下文不是函数，会抛出一个错误

```ts
const f = { bind: Function.prototype.bind };

f.bind();
// Uncaught TypeError: Bind must be called on a function
// at Object.bind (<anonymous>)
// at <anonymous>:1:6
```

我们根据实例类型在开头做一下判断，代码如下：

```ts
Function.prototype.bind2 = function (context) {
  if (typeof this !== 'function') {
    throw new Error('Bind must be called on a function');
  }

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs),
    );
  };

  fBound.prototype = Object.create(this.prototype);
  return fBound;
};
```

## 参考资源

- [深度解析 bind 原理、使用场景及模拟实现](https://muyiy.cn/blog/3/3.4.html#bind)


