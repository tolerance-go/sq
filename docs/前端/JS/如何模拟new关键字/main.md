# 如何模拟 new 关键字

## new 关键字的特性有哪些

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 ——（来自于 MDN）

```ts
function Car(color) {
  this.color = color;
}
Car.prototype.start = function () {
  console.log(this.color + ' car start');
};

var car = new Car('black');
car.color; // 访问构造函数里的属性
// black

car.start(); // 访问原型里的属性
// black car start
```

可以看出 new 创建的实例有以下 2 个特性

1. 访问到构造函数里的属性
2. 访问到原型里的属性

## 模拟步骤

当代码 new Foo(...) 执行时，会发生以下事情：

1. 一个继承自 Foo.prototype 的新对象被创建。

2. 使用指定的参数调用构造函数 Foo ，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。

3. 由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤 1 创建的对象。

### 1. new 关键字不可覆盖，使用 create 函数实现效果

new 返回一个新对象，通过 `Object.create(Con.prototype)` 继承构造函数的原型，同时通过 Con.apply(obj, arguments) 调用父构造函数实现继承，获取构造函数上的属性。

```ts
// 第一版
function create() {
  // 获得构造函数，arguments中去除第一个参数
  Con = [].shift.call(arguments);

  // 创建一个空的对象
  // 链接到原型，obj 可以访问到构造函数原型中的属性
  var obj = Object.create(Con.prototype);

  // 绑定 this 实现继承，obj 可以访问到构造函数中的属性
  Con.apply(obj, arguments);
  // 返回对象
  return obj;
}
```

测试代码如下：

```ts
// 测试用例
function Car(color) {
  this.color = color;
}
Car.prototype.start = function () {
  console.log(this.color + ' car start');
};

var car = create(Car, 'black');
car.color;
// black

car.start();
// black car start
```

### 2. 返回值模拟

构造函数返回值有如下三种情况：

1. 返回一个对象

   ```ts
   function Car(color, name) {
     this.color = color;
     return {
       name: name,
     };
   }

   var car = new Car('black', 'BMW');
   car.color;
   // undefined

   car.name;
   // "BMW"
   ```

   实例 car 中只能访问到返回对象中的属性。

2. 没有 return，即返回 undefined

   ```ts
   function Car(color, name) {
     this.color = color;
   }

   var car = new Car('black', 'BMW');
   car.color;
   // black

   car.name;
   // undefined
   ```

   实例 car 中只能访问到构造函数中的属性，

3. 返回 undefined 以外的基本类型

   ```ts
   function Car(color, name) {
     this.color = color;
     return 'new car';
   }

   var car = new Car('black', 'BMW');
   car.color;
   // black

   car.name;
   // undefined
   ```

   实例 car 中只能访问到构造函数中的属性，结果相当于没有返回值。

最终代码如下：

```ts
// 第一版
function create() {
  // 获得构造函数，arguments中去除第一个参数
  Con = [].shift.call(arguments);

  // 创建一个空的对象
  // 链接到原型，obj 可以访问到构造函数原型中的属性
  var obj = Object.create(Con.prototype);

  // 绑定 this 实现继承，obj 可以访问到构造函数中的属性
  var ret = Con.apply(obj, arguments);
  // 优先返回构造函数返回的对象
  return ret instanceof Object ? ret : obj;
}
```

## 参考资源

- [深度解析 new 原理及模拟实现](https://muyiy.cn/blog/3/3.5.html#%E5%AE%9A%E4%B9%89)


