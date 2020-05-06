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

   就是预编译阶段：有函数预编译 AO，全局预编译 GO；预编译是发生在代码执行的前一刻。

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

1. 创建 环境记录：存储变量和函数声明的实际位置

   1. 执行初始化阶段创建 变量对象(Variable object，VO)

   2. 执行初始化阶段创建 作用域链(Scope chain)

2. 创建 对外部环境的引用

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

## 执行阶段的内容有哪些

分配内存空间，最后执行代码，对变量进行赋值，取值等操作

如果执行期间，JS 引擎在 let 类型变量声明的位置找不到变量的定义，那么将为其准备一个 undefined 值

## 参考资源

- [JavaScript 深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)


