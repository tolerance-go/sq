# a 和 b 的 x 分别是什么内容

## 题目内容

```ts
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

a.x; // 这时 a.x 的值是多少
b.x; // 这时 b.x 的值是多少
```

## 答案分析

```ts
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

a.x; // undefined
b.x; // { n: 2 }
```

- 先取值再赋值
- 赋值操作是从右到左
- a 的地址在赋值后被修改，而 b 依然是 a 的引用

<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
