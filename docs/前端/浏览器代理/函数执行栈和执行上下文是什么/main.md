# 函数执行栈和执行上下文是什么

## 执行上下文是什么

执行上下文是当前 JavaScript 代码被解析和执行时所在环境的抽象概念

## 执行上下文的类型有哪些

- 全局执行上下文

  只有一个，浏览器中全局上下文的 this 指向 window 全局对象。

- 函数执行上下文

  存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文。

- Eval 函数执行上下文

  指的是运行在 eval 函数中的代码，很少用而且不建议使用

## 执行上下文的创建阶段有哪些

分为 2 个阶段：

1. 创建阶段
2. 执行阶段

### 创建阶段做的事情有哪些

1. 确定 this 的值，也被称为 This Binding。

2. LexicalEnvironment（词法环境） 组件被创建。

3. VariableEnvironment（变量环境） 组件被创建。

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

### 词法环境（Lexical Environment）是什么

#### 词法环境有哪些组成部分

1. 环境记录

   存储变量和函数声明的实际位置

2. 对外部环境的引用

   可以访问其外部词法环境

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

#### 词法环境有哪些类型

1. 全局环境

   是一个没有外部环境的词法环境，其外部环境引用为 null。拥有一个全局对象（window 对象）和语言预设的全局方法和属性（例如数组方法）以及任何用户自定义的全局变量，this 的值指向这个全局对象。

2. 函数环境

   用户在函数中定义的变量被存储在环境记录中，包含了 arguments 对象。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。

伪代码如下：

```ts{4,14}
GlobalExectionContext = {  // 全局执行上下文
  LexicalEnvironment: {       // 词法环境
    EnvironmentRecord: {     // 环境记录
      Type: "Object",        // 全局环境
      // 标识符绑定在这里
    }
    outer: <null>     // 对外部环境的引用
  }
}

FunctionExectionContext = { // 函数执行上下文
  LexicalEnvironment: {     // 词法环境
    EnvironmentRecord: {   // 环境记录
      Type: "Declarative",    // 函数环境
      // 标识符绑定在这里
    }
    outer: <Global or outer function environment reference> // 对外部环境的引用
  }
}
```

### VariableEnvironment（变量环境）是什么

变量环境也是一个词法环境，因此它具有上面定义的词法环境的所有属性：

- 变量环境也有 全局 和 函数 类型的区分
- 变量环境组成也包括 环境记录 和 外部环境引用

在 ES6 中，词法 环境和 变量 环境的区别在于前者用于存储 **函数声明 和 let 及 const 声明的变量绑定，而后者仅用于存储 var 声明的变量绑定**。

例子如下：

```ts
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
  var g = 20;
  return e * f * g;
}

c = multiply(20, 30);
```

上述代码的执行环境上下文伪代码如下：

```ts
GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      c: undefined,
    }
    outer: <null>
  }
}

FunctionExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里
      Arguments: {0: 20, 1: 30, length: 2},
    },
    outer: <GlobalLexicalEnvironment>
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里
      g: undefined
    },
    outer: <GlobalLexicalEnvironment>
  }
}
```

可以看到，用 var 声明的变量，其位置处于 `变量环境记录` 中，而非 var 的变量及函数声明，其位置处于 `词法环境记录` 中

### 变量提升的原因是什么

在执行上下文创建阶段，var 声明的变量会被设置为 undefined，let 和 const 声明的变量会被设置为未初始化。函数执行时，如果在变量声明之前访问 var 定义的变量，尽管是 undefined 但是不会报错，但如果在变量声明之前访问 let 和 const 定义的变量就会提示引用错误，这就是所谓的变量提升。

函数类型的声明，特指非变量形式的声明，在执行上下文创建阶段就以及分配好内存地址了，所以在函数定义前可以正常调用它，这就是所谓的函数变量提升；如果是用变量赋值的方式声明函数，参考上述变量提升

### 执行阶段的内容有哪些

根据变量定义，分配内存空间，最后执行代码，完成变量赋值，取值等操作

分配内存时，如果 Javascript 引擎在 let 和 const 类型变量声明的位置找不到变量的定义，那么将为其准备一个 undefined 值

## 执行上下文的存储位置在哪里

执行栈中

### 执行栈是什么

执行栈，也叫调用栈，具有 LIFO（后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。

首次运行 JS 代码时，会创建一个全局执行上下文并 Push 到当前的执行栈中。每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并 Push 到当前执行栈的栈顶。

根据执行栈 LIFO 规则，当栈顶函数运行完成后，其对应的函数执行上下文将会从执行栈中 Pop 出，上下文控制权将转移到当前执行栈的最顶部的执行上下文。

示例代码如下：

```ts
var a = 'Hello World!';

function first() {  
  console.log('Inside first function');  
  second();  
  console.log('Again inside first function');  
}

function second() {  
  console.log('Inside second function');  
}

first();  
console.log('Inside Global Execution Context');

// Inside first function
// Inside second function
// Again inside first function
// Inside Global Execution Context
```

![stack-exec](./assets/stack-exec.jpg)

<br/>
<br/>
<br/>
<Vssue :title="$title" />
