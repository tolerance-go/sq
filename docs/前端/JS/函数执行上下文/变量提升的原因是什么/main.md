# 变量提升的原因是什么

更加深入的回答，请查看[执行上下文是什么](../执行上下文是什么/main.md)

## 普通变量提升的原因是什么

在执行上下文创建阶段，var 声明的变量会被设置为 undefined，let 和 const 声明的变量会被设置为未初始化。函数执行时，如果在变量声明之前访问 var 定义的变量，尽管是 undefined 但是不会报错，但如果在变量声明之前访问 let 和 const 定义的变量就会提示引用错误，这就是所谓的变量提升。

```ts{7,8}
GlobalExectionContext = {
  ThisBinding: <Global Object>,
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      a: < uninitialized >,
      b: undefined,
      multiply: < func >
    }
    outer: <null>
  }
}
```

## 函数变量提升的原因是什么

函数类型的声明，特指非变量形式的声明，在执行上下文创建阶段就已经初始化引用了，所以在函数定义前可以正常调用它，这就是所谓的函数提升；如果是用变量赋值的方式声明函数，参考上述变量提升

```ts{9}
GlobalExectionContext = {
  ThisBinding: <Global Object>,
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      a: < uninitialized >,
      b: undefined,
      multiply: < func >
    }
    outer: <null>
  }
}
```

<br/>
<br/>
<br/>
<Vssue :title="$title" />
