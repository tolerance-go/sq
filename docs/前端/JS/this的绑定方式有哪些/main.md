# this 的绑定方式有哪些

this 的**指向**是在创建执行上下文的时候确定的，运行时可能修改它

1. 默认绑定（严格/非严格模式）
2. 隐式绑定
3. 显式绑定
4. new 绑定
5. 箭头函数绑定

## 默认绑定是什么

- 独立函数调用，可以把默认绑定看作是无法应用其他规则时的默认规则，this 指向全局对象。

- 严格模式下，不能将全局对象用于默认绑定，this 会绑定到 undefined。只有函数运行在非严格模式下，默认绑定才能绑定到全局对象。**在严格模式下调用函数则不影响默认绑定**

```ts
function foo() {
  // 运行在严格模式下，this会绑定到undefined
  'use strict';

  console.log(this.a);
}

var a = 2;

// 调用
foo(); // TypeError: Cannot read property 'a' of undefined

// --------------------------------------

function foo() {
  // 运行
  console.log(this.a);
}

var a = 2;

(function () {
  // 严格模式下调用函数则不影响默认绑定
  'use strict';

  foo(); // 2
})();
```

## 隐式绑定是什么

当函数调用有上下文对象时，隐式绑定规则会把函数中的 this 绑定到这个上下文对象。对象属性引用链中最后一层在调用中起作用。

```ts
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

obj.foo(); // 2
```

隐式绑定严格受限于调用方式，在赋值后丢失绑定，比如函数传参

```ts
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

var bar = obj.foo; // 函数别名

var a = 'oops, global'; // a是全局对象的属性

bar(); // "oops, global"

// ----------------------------------------

function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  // fn其实引用的是foo

  fn(); // <-- 调用位置！
}

var obj = {
  a: 2,
  foo: foo,
};

var a = 'oops, global'; // a是全局对象的属性

doFoo(obj.foo); // "oops, global"

// ----------------------------------------

// JS环境中内置的setTimeout()函数实现和下面的伪代码类似：
function setTimeout(fn, delay) {
  // 等待delay毫秒
  fn(); // <-- 调用位置！
}
```

## 显式绑定是什么

通过 `call` 或者 `apply` 方法调用。第一个参数是一个对象，在调用函数时将这个对象绑定到 this。因为直接指定 this 的绑定对象，称之为显示绑定。

```ts
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2  调用foo时强制把foo的this绑定到obj上
```

### 忽略 this 时候要注意什么

有的时候，我们不关心 this 是谁

```ts
function foo(a, b) {
  console.log('a:' + a + '，b:' + b);
}

// 把数组”展开“成参数
foo.apply(null, [2, 3]); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind(null, 2);
bar(3); // a:2，b:3
```

把 null 或者 undefined 作为 this 的绑定对象传入 call，apply 或者 bind，这些值在调用时会被忽略，实际应用的是默认规则。

总是传入 null 来忽略 this 绑定可能产生一些副作用。如果某个函数确实使用了 this，那默认绑定规则会把 this 绑定到全局对象中。

安全的做法就是传入一个特殊的对象（空对象），把 this 绑定到这个对象不会对你的程序产生任何副作用。

JS 中创建一个空对象最简单的方法是**Object.create(null)**，这个和 {} 很像，但是并不会链接到 Object.prototype ，所以比 {} 更空。

```ts
function foo(a, b) {
  console.log('a:' + a + '，b:' + b);
}

// 我们的空对象
var ø = Object.create(null);

// 把数组”展开“成参数
foo.apply(ø, [2, 3]); // a:2，b:3

// 使用bind(..)进行柯里化
var bar = foo.bind(ø, 2);
bar(3); // a:2，b:3
```

### 如何解决隐式绑定丢失的问题

通过显示绑定也就是显示调用 call 或者 apply 可以解决一般赋值和传递参数造成的隐式绑定丢失的问题

1. 硬绑定

   通过闭包，内部调用 call 或者 apply

   ```ts
   function foo() {
     console.log(this.a);
   }

   var obj = {
     a: 2,
   };

   var bar = function () {
     foo.call(obj);
   };

   bar(); // 2
   setTimeout(bar, 100); // 2

   // 硬绑定的bar不可能再修改它的this
   bar.call(window); // 2
   ```

   创建一个可以复用的 硬绑定 函数

   ```ts
   function foo(something) {
     console.log(this.a, something);
     return this.a + something;
   }

   // 简单的辅助绑定函数
   function bind(fn, obj) {
     return function () {
       return fn.apply(obj, arguments);
     };
   }

   var obj = {
     a: 2,
   };

   var bar = bind(foo, obj);

   var b = bar(3); // 2 3
   console.log(b); // 5
   ```

   ES5 内置了 Function.prototype.bind，bind 会返回一个硬绑定的新函数，用法如下：

   ```ts
   function foo(something) {
     console.log(this.a, something);
     return this.a + something;
   }

   var obj = {
     a: 2,
   };

   var bar = foo.bind(obj);

   var b = bar(3); // 2 3
   console.log(b); // 5
   ```

   JS 许多内置函数提供了一个可选参数，被称之为上下文（context），其作用和 bind 一样，确保回调函数使用指定的 this。这些函数实际上通过 call 和 apply 实现了显式绑定。

   ```ts
   function foo(el) {
     console.log(el, this.id);
   }

   var obj = {
     id: 'awesome',
   };

   var myArray = [1, 2, 3];
   // 调用foo(..)时把this绑定到obj
   myArray.forEach(foo, obj);
   // 1 awesome 2 awesome 3 awesome
   ```

2. 软绑定

   硬绑定可以把 this 强制绑定到指定的对象（new 除外），防止函数调用应用默认绑定规则。但是会降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改 this。

   如果给默认绑定指定一个全局对象和 undefined 以外的值，我们就可以用来区分默认绑定和隐式绑定与显示绑定

   ```ts
   if (!Function.prototype.softBind) {
     Function.prototype.softBind = function (obj) {
       var fn = this;
       // 捕获所有curried参数
       var curried = [].slice.call(arguments, 1);
       var bound = function () {
         return fn.apply(
           !this || this === (window || global) ? obj : this,
           curried.concat.apply(curried, arguments),
         );
       };
       return bound;
     };
   }
   ```

   软绑定版本的 foo() 可以手动将 this 绑定到 obj2 或者 obj3 上，但如果应用默认绑定，则会将 this 绑定到 obj。

   ```ts
   function foo() {
     console.log('name:' + this.name);
   }

   var obj = { name: 'obj' },
     obj2 = { name: 'obj2' },
     obj3 = { name: 'obj3' };

   // 默认绑定，应用软绑定，软绑定把this绑定到默认对象obj
   var fooOBJ = foo.softBind(obj);
   fooOBJ(); // name: obj

   // 隐式绑定规则
   obj2.foo = foo.softBind(obj);
   obj2.foo(); // name: obj2 !!!

   // 显式绑定规则
   fooOBJ.call(obj3); // name: obj3 !!!

   // 绑定丢失，应用软绑定
   setTimeout(obj2.foo, 10); // name: obj
   ```

## new 关键字绑定是什么

- 在 JS 中，构造函数只是使用 new 操作符时被调用的普通函数，他们不属于某个类，也不会实例化一个类。

- 包括内置对象函数（比如 Number(..)）在内的所有函数都可以用 new 来调用，这种函数调用被称为构造函数调用。

- 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个新对象。
2. 这个新对象会连接到构造函数的 Prototype 属性
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

使用 new 来调用 foo(..)时，会构造一个新对象并把它（bar）绑定到 foo(..)调用中的 this。

```ts
function foo(a) {
  this.a = a;
}

var bar = new foo(2); // bar和foo(..)调用中的this进行绑定
console.log(bar.a); // 2
```

手写一个 new 实现

```ts
function create() {
  // 获得构造函数，arguments中去除第一个参数
  var Con = [].shift.call(arguments);
  // 创建一个空的对象
  // 链接到原型，obj 可以访问到构造函数原型中的属性
  var obj = Object.create(Con.prototype)
  // 绑定 this 实现继承，obj 可以访问到构造函数中的属性
  var ret = Con.apply(obj, arguments);
  // 优先返回构造函数返回的对象
  return ret instanceof Object ? ret : obj;
}

function Person() {...}

// 使用内置函数new
var person = new Person(...)

// 使用手写的new，即create
var person = create(Person, ...)
```

## 箭头函数绑定是什么

ES6 新增一种特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据函数执行上下文的外部环境引用来决定 this，也就是函数定义时的外部可访问作用域

箭头函数的绑定无法运行时被修改，new 也不行。不过可以修改函数调用时的外部作用域来间接修改 this 指向。

```ts
function foo() {
  // 返回一个箭头函数
  return (a) => {
    // this继承自foo()
    console.log(this.a);
  };
}

var obj1 = {
  a: 2,
};

var obj2 = {
  a: 3,
};

var bar = foo.call(obj1);
bar.call(obj2); // 2，不是3！
```

ES6 之前和箭头函数类似的模式，采用的是闭包的方式

```ts
function foo() {
  var self = this; // lexical capture of this
  setTimeout(function () {
    console.log(self.a); // self只是继承了foo()函数的this绑定
  }, 100);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2
```

## 绑定方式的优先级是什么

箭头函数 > new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定

## 参考资源

- [JavaScript深入之史上最全--5种this绑定全面解析](https://muyiy.cn/blog/3/3.1.html)

<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
