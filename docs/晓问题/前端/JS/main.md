# JS

## 1. `in` 操作符会检查原型链吗 <Badge text="简单" />

当然是会啦

## 2. 如何在不访问属性值的情况下判断对象中是否存在某个属性呢 <Badge text="简单" />

- `in` 操作符

- `Object.prototype.hasOwnProperty`

## 3. `Object.assign` 和 `...` 展开语法谁会触发 setters 呢 <Badge text="简单" />

`Object.assign`

## 4. 如何检测对象上的 `Symbol` 属性呢 <Badge text="简单" />

- `Object.getOwnPropertySymbols`

- `Reflect.ownKeys`，等同于如下代码

  ```ts
  Object.getOwnPropertyNames(target).concat(
    Object.getOwnPropertySymbols(target),
  );
  ```

## 5. 位掩码有哪些常规操作 <Badge text="中等" type='warning' />

- a | b：添加标志位 a 和 b

- mask & a：取出标志位 a

- mask & ~a：清除标志位 a

- mask ^ a：取出与 a 的不同部分
