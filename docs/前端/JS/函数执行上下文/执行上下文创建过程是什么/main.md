# 执行上下文创建过程是什么

## 执行上下文何时创建

当 JavaScript 代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

## 可执行代码有哪些种类

- 全局代码
- 函数代码
- eval 代码

## 执行上下文创建有哪些阶段

分为 2 个阶段：

1. 创建阶段

   就是预编译阶段：有函数预编译 AO，全局预编译 GO；预编译是发生在函数执行的前一刻。

2. 执行阶段

## 执行上下文创建阶段都做了哪些事情

1. 确定 this 的值，也被称为 This Binding。

2. 环境对象被创建

   - LexicalEnvironment（词法环境） 组件被创建。
   - VariableEnvironment（变量环境） 组件被创建。

伪代码如下：

```ts
ExecutionContext = {
  ThisBinding = <this value>,     // 确定this
  LexicalEnvironment = { ... },   // 词法环境
  VariableEnvironment = { ... },  // 变量环境
}
```

### This Binding 在不同上下文中 this 的值有什么不同

- 全局执行上下文中，this 的值指向全局对象，在浏览器中 this 的值指向 window 对象，而在 nodejs 中指向这个文件的 module 对象。

- 函数执行上下文中，this 的值取决于函数的调用方式。具体有：默认绑定、隐式绑定、显式绑定（硬绑定）、new 绑定、箭头函数。

### 环境对象创建的过程是什么

1. 创建 环境记录 -> 变量对象(Variable object，VO)

   存储变量和函数声明的实际位置

2. 创建 对外部环境的引用 -> 作用域链(Scope chain)

   可以访问其外部词法环境

伪代码如下：

```ts{3,7}
GlobalExectionContext = {  // 全局执行上下文
  LexicalEnvironment: {       // 词法环境
    EnvironmentRecord: {     // 环境记录
      Type: "Object",        // 全局环境
      // 标识符绑定在这里
    }
    outer: <null>     // 对外部环境的引用
  }
}
```

### 变量对象会包括哪些基本内容

- 函数的所有形参 (如果是函数上下文)

  - 由名称和对应值组成的一个变量对象的属性被创建
  - 没有实参的话，属性值设为 undefined

- 函数声明

  - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
  - 如果变量对象已经存在相同名称的属性，则完全替换这个属性

- 变量声明

  - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
  - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明**不会干扰**已经存在的这类属性

  ```ts
  function foo() {
    console.log(a);
    a = 1;
  }

  foo(); // ???
  ```

  上述这段代码会报错，因为 foo 的执行环境对象没有 a，它不是以名称和对应值创建的

  参考代码如下：

  ```ts
  function foo(a) {
    var b = 2;
    function c() {}
    var d = function () {};

    b = 3;
  }

  foo(1);
  ```

  在创建执行上下文后：

  ```ts
  AO = {
      arguments: {
          0: 1,
          length: 1
      },
      a: 1,
      b: undefined,
      c: reference to function c(){},
      d: undefined
  }
  ```

  在代码执行后：

  ```ts
  AO = {
      arguments: {
          0: 1,
          length: 1
      },
      a: 1,
      b: 3,
      c: reference to function c(){},
      d: reference to FunctionExpression "d"
  }
  ```

### 全局执行上下文的环境对象中的变量对象是谁

在全局上下文中，我们用全局对象（Global Object，GO）来表示变量对象。

对外部环境的引用（作用域链条）指向外部环境对象，环境对象的查找就是在环境记录（变量对象）上进行的，而全局对象是作用域链的头，这意味着全局环境记录就是全局对象，在客户端全局对象是 window，node 中全局对象是指向文件的 module 对象

### 函数执行上下文中变量对象新增了哪些内容

在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。

1. 新增了 arguments 属性。

   arguments 属性值是 Arguments 对象。

   > 调用函数时，会为其创建一个 Arguments 对象，并自动初始化局部变量 arguments，指代该 Arguments 对象。所有作为参数传入的值都会成为 Arguments 对象的数组元素。

2. 函数的所有形参，如果没有实参的话，属性值设为 undefined

## 执行阶段的内容有哪些

分配内存空间，最后执行代码，对变量进行赋值，取值等操作

如果执行期间，JS 引擎在 let 类型变量声明的位置找不到变量的定义，那么将为其准备一个 undefined 值

## 参考资源

- [JavaScript 深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)

<br/>
<br/>
<br/>
<Vssue :title="$title" />
