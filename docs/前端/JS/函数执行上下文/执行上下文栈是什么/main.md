# 执行上下文栈是什么

执行栈，也叫调用栈，具有 LIFO（后进先出）结构，用于存储在代码**执行**期间创建的所有执行上下文。

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
  