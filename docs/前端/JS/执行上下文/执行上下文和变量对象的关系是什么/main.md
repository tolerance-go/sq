# 执行上下文和变量对象的关系是什么

执行上下文初始化阶段会创建变量对象，记录在环境对象的环境记录上，不同类型上下文变量对象也不同

## 变量对象会包括哪些基本内容

- 函数的所有形参 (如果是函数上下文)

  - 由名称和对应值组成的一个变量对象的属性被创建
  - 没有实参的话，属性值设为 undefined

- 客户端和语言预设的属性，方法和对象 (如果是全局上下文)

- 函数声明

  - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
  - 如果变量对象已经存在相同名称的属性，则**完全替换**这个属性

- 变量声明

  - 由名称和对应值（undefined）组成一个变量对象的属性被创建

    需要注意不同的声明类型，初始值也不同：let 和 const 声明的变量初始化为 `uninitialized`

  - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明**不会干扰**已经存在的这类属性

  ```ts
  function foo() {
    console.log(a);
    a = 1;
  }

  foo(); // ???
  ```

  上述这段代码会报错，因为 foo 的环境记录中，没有 a，沿着作用域链向上查找也没有，它不是以名称和对应值创建的，`a = 1` 会对全局作用域进行赋值

  参考代码如下：

  ```ts
  function foo(a) {
    var b = 2;
    function c() {}
    var d = function () {};

    b = 3;
  }

  foo(1);
  ```

  在执行上下文初始化后：

  ```ts
  AO = {
      arguments: {
          0: 1,
          length: 1
      },
      a: 1,
      b: undefined,
      c: reference to function c(){},
      d: undefined
  }
  ```

  在代码执行后：

  ```ts
  AO = {
      arguments: {
          0: 1,
          length: 1
      },
      a: 1,
      b: 3,
      c: reference to function c(){},
      d: reference to FunctionExpression "d"
  }
  ```

### 全局执行上下文的环境对象中的变量对象是谁

在全局上下文中，构造的变量对象就是全局对象（Global Object，GO）：window。

### 函数执行上下文中变量对象包含了哪些额外内容

在函数上下文中，构造的变量对象就是活动对象(activation object, AO)，相较于一般变量对象新增了如下属性：

1. 新增了 arguments 属性。

   arguments 属性值是 Arguments 对象。

   > 调用函数时，会为其创建一个 Arguments 对象，并自动初始化局部变量 arguments，指代该 Arguments 对象。所有作为参数传入的值都会成为 Arguments 对象的数组元素。

2. 函数的所有形参，如果没有实参的话，属性值设为 undefined


  