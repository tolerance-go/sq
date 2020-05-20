# Math.trunc 的作用以及有哪些优点

## 作用

`Math.trunc()` 作用就是去除一个数的小数部分

## 优点

- 对比 parseInt，接收数字类型参数，不会因为不当的隐式转换会造成错误

  parseInt 它第一个参数接收 string 类型，如果传递数字将会转化为 string，`parseInt(0.0000006)` 得到的结果是 6，因为小数连续超过 6 个 0 的数字将会使用科学计数法表示，`0.0000006+''==='6e-7'` 因此刚才的表达式实际上是 `parseInt('6e-7')`，同时 parseInt 有如下特性：

  - **只有字符串中的第一个数字会被返回**
  - 开头和结尾的空格是允许

  最终 parseInt('6e-7') 将转换为 parseInt('6') 结果为 6

- 对比 Math.ceil 和 Math.floor，对于数值的正负情况不一样时不用分别考虑了

  之前 `x < 0 ? Math.ceil(x) : Math.floor(x)` 可以直接使用 `Math.trunc(x)`
