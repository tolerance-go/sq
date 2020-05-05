# 如何禁止函数被当作构造器调用

模拟箭头函数和 Symbol 的行为，参考代码如下：

```ts
function Foo() {
  if (this instanceof Foo) {
    throw new Error('Foo is not a constructor');
  }
}
new Foo();
```

## 原理是什么

new 关键字会提前构造 this 对象，该对象会连接到构造函数的原型链上，instanceof 可以用来检测对象是否存在于原型链上

<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
