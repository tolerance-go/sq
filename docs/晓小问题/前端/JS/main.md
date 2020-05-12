# JS

## 9. && 和 || 的优先级谁更高呢 <Badge text="简单" />

::: details 点击查看答案

&&

:::

## 8. 如何判断准确判断对象数组类型呢 <Badge text="简单" />

::: details 点击查看答案

- `Object.prototype.toString.call(item) === '[object Array]'`

- `Array.isArray(item)`

:::

## 7. `Object.getPrototypeOf(Number)` 和 `Number.prototype` 是否相等 <Badge text="简单" />

::: details 点击查看答案

不相等，`Object.getPrototypeOf` 是用来获取 `__proto__` 属性的

:::

## 6. null 和 undefined 有没有 constructor 属性呢 <Badge text="简单" />

::: details 点击查看答案

没有

:::

## 5. 位掩码有哪些常规操作 <Badge text="中等" type='warning' />

::: details 点击查看答案

- a | b：添加标志位 a 和 b

- mask & a：取出标志位 a

- mask & ~a：清除标志位 a

- mask ^ a：取出与 a 的不同部分

:::

## 4. 如何检测对象上的 `Symbol` 属性呢 <Badge text="简单" />

::: details 点击查看答案

- `Object.getOwnPropertySymbols`

- `Reflect.ownKeys`，等同于如下代码

  ```ts
  Object.getOwnPropertyNames(target).concat(
    Object.getOwnPropertySymbols(target),
  );
  ```

:::

## 3. `Object.assign` 和 `...` 展开语法谁会触发 setters 呢 <Badge text="简单" />

::: details 点击查看答案

`Object.assign`

:::

## 2. 如何在不访问属性值的情况下判断对象中是否存在某个属性呢 <Badge text="简单" />

::: details 点击查看答案

- `in` 操作符

- `Object.prototype.hasOwnProperty`

:::

## 1. `in` 操作符会检查原型链吗 <Badge text="简单" />

::: details 点击查看答案

会

:::
