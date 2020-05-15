# 介绍一下模块化进程和区别

## 函数模块

一个函数就是一个模块

缺点：污染了全局变量，无法保证不会与其它模块发生冲突，而且模块成员之间看不出直接关系。

立即执行函数为一个模块

```js
var module1 = (function () {
  var _sum = 0;
  var foo1 = function () {};
  var foo2 = function () {};
  return {
    foo1: foo1,
    foo2: foo2,
  };
})();
```

利用立即执行函数内的作用域已经闭包来实现模块功能，导出我们想要导出的成员。

此时外部代码就不能读取到\_sum 了：

```js
console.log(module1._sum); // undefined
```

## 对象模块

一个对象就是一个模块

```js
var module1 = new Object({
  _sum: 0,
  foo1: function () {},
  foo2: function () {},
});
```

缺点：会暴露所有模块成员，内部的状态可能被改写。

## CommonJS 规范

### 暴露模块

暴露模块有两种方式：

1. `module.exports = {}`
2. `exports.xxx = 'xxx'`

module 这个变量它代表的就是整个模块，其实这个 module 变量是有一个属性 exports 的，它是一个叫做 exports 变量的引用，我们可以写一下伪代码：

```js
var exports = {};
var module = {
  exports: exports,
};
return module.exports;
```

最后导出的是 module.exports，而不是 exports。

如果你在代码中试图 `exports = { name: 'lindaidai' }`，你会发现在引入的地方根本获取不到 name 属性。

```js
exports = {
  name: 'lindaidai',
};
```

### 引用模块

对于模块的引用使用全局方法 require()就可以了。

另外还有一点比较重要，那就是 require()的参数甚至能允许你是一个表达式。

因为 module 对象是运行时生成的

```js
var m1Url = './m1.js';
var m1 = require(m1Url);

// 甚至做一些字符串拼接：
var m1 = require('./m' + '1.js');
```

### 模块标识符

模块标识符其实就是你在引入模块时调用 require()函数的参数。

```js
// 直接导入
const path = require('path');
// 相对路径
const m1 = require('./m1.js');
// 直接导入
const lodash = require('lodash');
```

分为以下三种：

1. 核心模块(Node.js 自带的模块)
2. 路径模块(相对或绝对定位开始的模块)
3. 自定义模块(node_modules 里的模块)

#### 路径分析

三种模块的查找方式：

1. 核心模块，直接跳过路径分析和文件定位
2. 路径模块，直接得出相对路径就好了
3. 自定义模块，先在当前目录的 node_modules 里找这个模块，如果没有，它会往上一级目录查找，查找上一级的 node_modules，依次往上，直到根目录下都没有, 就抛出错误。

这个过程其实也叫做**路径分析**。

```js
console.log(module.paths);
// [
//   '/Users/lindaidai/codes/test/CommonJS和ES6/commonJS/node_modules',
//   '/Users/lindaidai/codes/test/CommonJS和ES6/node_modules',
//   '/Users/lindaidai/codes/test/node_modules',
//   '/Users/lindaidai/codes/node_modules',
//   '/Users/lindaidai/node_modules',
//   '/Users/node_modules',
//   '/node_modules'
// ]
```

#### 文件定位

上面 👆 已经介绍完了路径分析，但是还有一个问题，就是我们导入的模块它的后缀(扩展名)是可以省略的啊，那 Node 怎么知道我们是导入了一个 js 还是一个 json 呢？这其实就涉及到了文件定位。

在 NodeJS 中, 省略了扩展名的文件, 会依次补充上.js, .node, .json 来尝试, **如果传入的是一个目录, 那么 NodeJS 会把它当成一个包来看待**, 会采用以下方式确定文件名

- 第一步, 找出目录下的 package.json, 用 JSON.parse()解析出 main 字段

- 第二步, 如果 **main 字段**指定的文件还是省略了扩展, 那么会依次补充.js, .node, .json 尝试.

- 第三步, 如果 main 字段制定的文件不存在, 或者根本就不存在 package.json, 那么会**默认加载这个目录下的 index.js, index.node, index.json 文件**.

以上就是文件定位的过程, 再搭配上路径分析的过程, 进行排列组合, 这得有多少种可能呀. 所以说, 自定义模块的引入, 是最费性能的.

### CommonJS 规范的特点

1. 所有代码都运行在**模块作用域**，不会污染全局作用域；

2. 模块是**同步加载的**，即只有加载完成，才能执行后面的操作；

3. **模块在首次执行后就会缓存**，再次加载只返回缓存结果，如果想要再次执行，可清除缓存；

4. CommonJS 输出是值的拷贝(即，require 返回的值是被输出的值的拷贝，模块内部的变化也不会影响这个值，**浅拷贝，如果是引用类型的话还是会影响依赖模块的**)。

## AMD 规范

模块化这种概念不仅仅适用于服务器端，客户端同样也适用。

而 CommonJS 规范中的同步加载就不太适合用在客户端(浏览器)环境了，如果前面的模块加载很慢就会引起阻塞，而加载速度是由网络速度解决的，这个和 node 中的硬盘读取速度比起来，非常不靠谱

1. 服务器端所有的模块都存放在本地硬盘中，可以同步加载完成，等待时间就是硬盘的读取时间。
2. 浏览器，所有的模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于”假死”状态。

异步的方式加载模块。

AMD 是 Asynchronous Module Definition 的缩写，也就是"异步模块定义"。

它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

### 定义并暴露模块

此时就需要另一个重要的方法来定义我们的模块：define()。

它其实是会有三个参数：

```js
define(id?, dependencies?, factory)
```

- id: 一个字符串，表示模块的名称，但是是可选的
- dependencies: 一个数组，是我们当前定义的模块要依赖于哪些模块，数组中的每一项表示的是要依赖模块的相对路径，且这个参数也是可选的
- factory: 工厂方法，一个函数，这里面就是具体的模块内容了

## CMD 规范

CMD (Common Module Definition), 是 seajs 推崇的规范，CMD 则是依赖就近，用的时候再 require。

```js
define(function (require, exports, module) {
  var math = require('./math');
  math.print();
});
```

看着和 AMD 有点像的，没错，其实 define()的参数甚至都是一样的：

```js
define(id?, dependencies?, factory)
```

### CMD 和 AMD 的区别

1. AMD 推崇依赖前置，在定义模块的时候就要声明其依赖的模块
2. CMD 推崇就近依赖，只有在用到某个模块的时候再去 require

**CMD 是就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块。**

让我们来看看最后一个 factory 它参数。

factory 函数中是会接收三个参数：

1. require

2. exports

3. module

AMD 中会把当前模块的依赖模块放到 dependencies 中加载，并在 factory 回调中拿到加载成功的依赖

CMD 一般不在 dependencies 中加载，而是写在 factory 中，使用 require 加载某个依赖模块

> AMD 和 CMD 最大的区别是对依赖模块的**执行时机**处理不同，注意不是加载的时机或者方式不同，二者皆为异步加载模块。

```js
define(function (require, exports, module) {
  console.log('我是math, 我被加载了...');
  var m1 = require('m1'); // 虽然依赖 m1，但是上面这句话会先打出来
  var add = function (a, b) {
    return a + b;
  };
  var print = function () {
    console.log(m1.name);
  };
  module.exports = {
    add: add,
    print: print,
  };
});
```

## ES6 Modules 规范

### export 导出模块

export 有两种模块导出方式：

1. 命名式导出(名称导出)
2. 默认导出(自定义导出)

#### 命名式导出(名称导出)

```js
export const b = 2;

// 或者用 as 来命名
const a = 1;
export { a as outA };
```

**接口名与模块内部变量之间，建立了一一对应的关系**

#### 默认导出(自定义导出)

默认导出会在 export 后面加上一个 default：

```js
// 1.
const a = 1;
export default a;

// 2.
const a = 1;
export default { a };

// 3.
export default function() {}; // 可以导出一个函数
export default class(){}; // 也可以出一个类
```

其实，默认导出可以理解为另一种形式上的命名导出，也就是说 a 这个属性名相当于是被我重写了成了 default：

```js
const a = 1;
export defalut a;
// 等价于
export { a as default }
```

所以，我们才可以用 `const a = 1; export default a;` 这种方式导出一个值。

### import 导入模块

import 模块导入与 export 模块导出功能相对应，也存在两种模块导入方式：命名式导入（名称导入）和默认导入（定义式导入）。

```js
// 某个模块的导出 moudule.js
export const a = 1;

// 模块导入
// 1. 这里的a得和被加载的模块输出的接口名对应
import { a } from './module';

// 2. 使用 as 换名
import { a as myA } from './module';

// 3. 若是只想要运行被加载的模块可以这样写，但是即使加载2次也只是运行一次
import './module';

// 4. 整体加载
import * as module from './module';

// 5. default接口和具名接口
import module, { a } from './module';
```

#### export ... from...

其实还有一种写法，可以将 export 和 from 结合起来用。

```js
import { someVariable } from './a';

export { someVariable };
```

不过这种方式有一点需要注意：

这样的方式不会将数据添加到该聚合模块的作用域, 也就是说, 你无法在该模块(也就是 b)中使用 someVariable。

### ES6 Modules 规范的特点

1. 输出使用 export
2. 输入使用 import
3. 可以使用 `export...from...` 这种写法来达到一个"中转"的效果
4. 输入的模块变量是不可重新赋值的，它只是个可读引用，不过却可以改写属性
5. export 命令和 import 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。
6. import 命令具有提升效果，会提升到整个模块的头部，首先执行。

### CommonJS 与 ES6 Modules 规范的区别

1. CommonJS 模块是**运行时同步加载**，ES6 Modules 是**编译时输出接口**

2. CommonJS 输出是值的拷贝；ES6 Modules 输出的是值的引用，被输出模块的内部的改变会影响引用的改变

3. CommonJs 导入的**模块路径可以是一个表达式**，因为它使用的是 require() 方法，module 对象是运行时创建的；而 ES6 Modules 只能是字符串

4. CommonJS this 指向当前模块，ES6 Modules this 指向 undefined

5. 且 ES6 Modules 中没有这些顶层变量：`arguments`、`require`、`module`、`exports`、`__filename`、`__dirname`

> 关于第一个差异，是因为 CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

关于第二点，我们来看 2 个例子:

commonjs 中输出的是 `module.exports` 的浅拷贝

<<< @/docs/前端/JS/介绍一下模块化进程和区别/cjs/m.js

<<< @/docs/前端/JS/介绍一下模块化进程和区别/cjs/t.js

输出的内容为：

```bash
a 1
a 2
```

es 规范下输出的模块属性值的引用

<<< @/docs/前端/JS/介绍一下模块化进程和区别/es/m.ts

<<< @/docs/前端/JS/介绍一下模块化进程和区别/es/t.ts

```bash
a 1
a+ 2
```

## 参考资源

- [如何回答好这个高频面试题：CommonJS 和 ES6 模块的区别？](https://mp.weixin.qq.com/s/eMC2ZQrFpuHbgQooQdv4xg)
