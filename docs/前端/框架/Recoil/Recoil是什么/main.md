# Recoil 是什么

为 React 的外部状态管理提供了函数式的解决方案

## 动机

出于兼容性和简便性的考虑，最好使用 React 的内置状态管理功能，而不要使用外部全局状态。但是 React 有一定的局限性：

1. 只能通过将其提升到公共祖先来共享组件状态，但这可能包括一棵巨大的树，然后需要重新渲染。
2. 上下文只能存储一个值，而不能存储不确定的一组值，每个值都有自己的使用者。
3. 这两种方法都使得很难从树的叶子（使用状态的地方）代码分割树的顶部（状态必须存在的地方）。

我们希望在保持 API 以及语义和行为尽可能 Reactish 的同时进行改进。

1. 我们获得了一个无样板的 API，其中共享状态具有与 React 本地状态相同的简单 get / set 接口（但如果需要，也可以用 reducer 等封装）。
2. 我们有可能与并发模式和其他新的 React 功能兼容。
3. 状态定义是增量式和分布式的，从而可以进行代码拆分。
4. 可以用派生数据替换状态，而无需修改使用它的组件。
5. 派生数据可以在同步和异步之间切换，而无需修改使用它的组件。
6. 我们可以将导航视为 first-class 的概念，甚至可以对链接中的状态转换进行编码。
7. 以向后兼容的方式持久保存整个应用程序状态很容易，因此持久保存的状态可以在应用程序更改后继续存在。

## 特性

1. 最小和反应（Reactish）

   Recoil 像 React 一样工作和思考。将一些添加到您的应用程序并获得快速灵活的共享状态。

2. 数据流图

   派生数据异步查询已通过纯函数和高效订阅方式实现。

3. 跨应用观察

   通过观察应用程序中所有状态的变化来实现持久性，路由，时间旅行调试或撤消，而不会影响代码拆分。

## 核心概念

### 原子

原子是状态单位。它们是可更新和可订阅的：当原子被更新时，每个被订阅的组件都将使用新值重新呈现。也可以在运行时创建。可以使用原子来代替 React 本地组件状态。如果多个组件使用相同的原子，则所有这些组件共享其状态。

原子需要一个唯一的密钥，该密钥可用于调试，持久性以及某些高级 API，这些 API 可让您查看所有原子的图。两个原子具有相同的密钥是一个错误，因此请确保它们在全局上是唯一的。像 React 组件状态一样，它们也具有默认值。

```tsx
const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
```

使用

```tsx
const TextInput = () => {
  const [text, setText] = useRecoilState(textState);

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
```

### 选择器

选择器是接受的原子或其它选择作为输入的纯函数。当这些上游原子或选择器更新时，将重新计算（re-evaluated）选择器。组件可以像原子一样订阅选择器，然后在选择器更改时将重新呈现它们。

选择器用于计算基于状态的派生数据。这使我们避免了冗余状态，通常无需使用 reduce 来保持状态同步和有效。取而代之的是，最小状态集存储在原子中，而其他所有内容都根据该最小状态有效地计算。由于选择器会跟踪需要哪些组件以及它们所依赖的状态，因此它们使这种功能方法更加有效。

从组件的角度来看，选择器和原子具有相同的界面，因此可以互相替换。

```tsx
const charCountState = selector({
  key: 'charCountState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(textState);

    return text.length;
  },
});
```

使用

```tsx
const CharacterCount = () => {
  const count = useRecoilValue(charCountState);

  return <>Character Count: {count}</>;
};
```

## 使用

### 同步和计算属性

参考概念的示例代码

### 异步

```tsx
const encryptionState = selector({
  key: 'asyncState',
  get: async ({ get }) => {
    const text = get(textState);
    await delay(1000);
    return text.replace(/./gi, '*');
  },
});

const EncryptionCount = () => {
  const contentLoadable = useRecoilValueLoadable(encryptionState);

  try {
    contentLoadable.getValue();
  } catch (promise) {
    console.log(promise === contentLoadable.toPromise()); // true
  }

  return (
    <p>
      Encryption content:
      {contentLoadable.state === 'loading'
        ? 'loading'
        : contentLoadable.getValue()}
    </p>
  );
};
```

## 完整示例

<!-- prettier-ignore -->
<<< @/docs/前端/框架/Recoil/Recoil是什么/index.tsx

<Visual relative="./index.html" />

## 参考资源

- [Recoil 官网](https://recoiljs.org/docs/introduction/installation)
