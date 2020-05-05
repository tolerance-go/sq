# 执行上下文栈是什么

执行栈，也叫调用栈，具有 LIFO（后进先出）结构，用于存储在代码**执行**期间创建的所有执行上下文。

首次运行 JS 代码时，会创建一个全局执行上下文并 Push 到当前的执行栈中。每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并 Push 到当前执行栈的栈顶。

根据执行栈 LIFO 规则，当栈顶函数运行完成后，其对应的函数执行上下文将会从执行栈中 Pop 出，上下文控制权将转移到当前执行栈的最顶部的执行上下文。

示例代码如下：

```ts
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f;
}

var foo = checkscope(); // foo指向函数f
foo(); // 调用函数f()
```

简要的执行过程如下：

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈

2. 全局执行上下文初始化

3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈

4. checkscope 执行上下文初始化，创建变量对象、作用域链、this 等

5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈

7. f 执行上下文初始化，创建变量对象、作用域链、this 等

8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

![stack-exec](./assets/stack-exec.jpg)

<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
