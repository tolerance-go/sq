# 执行上下文是什么

执行上下文是当前 JavaScript 代码被解析和执行时所在环境的抽象概念

## 执行上下文的类型有哪些

- 全局执行上下文

  只有一个，浏览器中全局上下文的 this 指向 window 全局对象。

- 函数执行上下文

  存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文。

- Eval 函数执行上下文

  指的是运行在 eval 函数中的代码，很少用而且不建议使用

### 执行上下文包含哪些属性

1. this 值

2. 环境对象

   - LexicalEnvironment（词法环境）
   - VariableEnvironment（变量环境）

伪代码如下：

```ts
ExecutionContext = {
  ThisBinding = <this value>,     // 确定this
  LexicalEnvironment = { ... },   // 词法环境
  VariableEnvironment = { ... },  // 变量环境
}
```

#### 词法环境有哪些组成部分

1. 环境记录 -> 变量对象(Variable object，VO)

   存储变量和函数声明的实际位置

2. 对外部环境的引用 -> 作用域链(Scope chain)

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

#### 词法环境对象有哪些类型

1. 全局环境

   是一个没有外部环境的词法环境，其外部环境引用为 null。拥有一个全局对象（window 对象）：全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。this 的值指向这个全局对象。

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

函数被调用的时候才开始创建函数执行上下文，当然也是先由创建再到入栈执行，再次遇到执行函数语句，反复上述步骤，GlobalExectionContext 和 FunctionExectionContext 先后创建并入栈执行，如果遇到递归在没有结束前，函数执行栈被撑爆掉，程序将会报错

可以观察到，用 var 声明的变量，其位置处于 `变量环境记录` 中，初始化值为 undefined，而 let 和 const 声明的变量及函数声明，其位置处于 `词法环境记录` 中，其中函数初始值为函数引用，而其它则为未初始化状态，这也同样回答了[变量提升的原因是什么](../变量提升的原因是什么/main)

## 参考资源

- [理解 Javascript 执行上下文和执行栈](https://juejin.im/post/5bdfd3e151882516c6432c32)

<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
