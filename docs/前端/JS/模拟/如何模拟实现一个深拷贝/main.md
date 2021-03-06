# 如何模拟实现一个深拷贝

## 需要解决的问题

- 对象
- 数组
- 循环引用
- 引用丢失
- Symbol
- 递归爆栈

## 浅拷贝 + 递归

浅拷贝时判断属性值是否是对象，如果是对象就进行递归操作，两个一结合就实现了深拷贝。

根据[上篇文章内容](../如何模拟实现一个Object[assign]/main.html)，我们可以写出简单浅拷贝代码如下。

```ts
function cloneShallow(source) {
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  return target;
}

// 测试用例
var a = {
  name: 'muyiy',
  book: {
    title: "You Don't Know JS",
    price: '45',
  },
  a1: undefined,
  a2: null,
  a3: 123,
};
var b = cloneShallow(a);

a.name = '高级前端进阶';
a.book.price = '55';

console.log(b);
// {
//   name: 'muyiy',
//   book: { title: 'You Don\'t Know JS', price: '55' },
//   a1: undefined,
//   a2: null,
//   a3: 123
// }
```

上面代码是浅拷贝实现，只要稍微改动下，加上是否是对象的判断并在相应的位置使用递归就可以实现简单深拷贝。

```ts
function cloneDeep1(source) {
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object') {
        target[key] = cloneDeep1(source[key]); // 注意这里
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// 使用上面测试用例测试一下
var b = cloneDeep1(a);
console.log(b);
// {
//   name: 'muyiy',
//   book: { title: 'You Don\'t Know JS', price: '45' },
//   a1: undefined,
//   a2: {},
//   a3: 123
// }
```

一个简单的深拷贝就完成了，但是这个实现还存在很多问题。

1. 没有对传入参数进行校验，传入 null 时应该返回 null 而不是 {}

2. 对于对象的判断逻辑不严谨，因为 typeof null === 'object'

3. 没有考虑数组的兼容

## 拷贝数组

我们来看下对于对象的判断

```ts
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
```

但是用在这里并不合适，因为我们要保留数组这种情况，所以这里使用 typeof 来处理。

```ts
typeof null; //"object"
typeof {}; //"object"
typeof []; //"object"
typeof function foo() {}; //"function" (特殊情况)
```

改动过后的 isObject 判断逻辑如下。

```ts
function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}
```

所以兼容数组的写法如下。

```ts
function cloneDeep2(source) {
  if (!isObject(source)) return source; // 非对象返回自身

  var target = Array.isArray(source) ? [] : {};

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep2(source[key]); // 注意这里
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// 使用上面测试用例测试一下
var b = cloneDeep2(a);
console.log(b);
// {
//   name: 'muyiy',
//   book: { title: 'You Don\'t Know JS', price: '45' },
//   a1: undefined,
//   a2: null,
//   a3: 123
// }
```

考虑正则匹配后的数组，需要将 index 和 input 属性拷贝过去

```ts
var re = /quick\s(brown).+?(jumps)/gi;
var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
console.log(result);
// [
//	0: "Quick Brown Fox Jumps" 	// 匹配的全部字符串
//	1: "Brown"					// 括号中的分组捕获
//	2: "Jumps"
//	groups: undefined
//	index: 4					// 匹配到的字符位于原始字符串的基于0的索引值
//	input: "The Quick Brown Fox Jumps Over The Lazy Dog" // 原始字符串
//	length: 3
// ]
```

判断逻辑是：

1. 数组长度大于 0
2. 数组第一个元素是字符串类型
3. 数组存在 index 属性。

```ts
if (
  source.length &&
  typeof source[0] == 'string' &&
  hasOwnProperty.call(source, 'index')
) {
  target.index = source.index;
  target.input = source.input;
}
```

## 循环引用

我们知道 JSON 无法深拷贝循环引用，遇到这种情况会抛出异常。

```ts
const a = {};
a.circleRef = a;

JSON.parse(JSON.stringify(a));
// TypeError: Converting circular structure to JSON
```

### 1. 使用哈希表

解决方案很简单，其实就是循环检测，我们设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即可。

```ts
function cloneDeep3(source, hash = new Map()) {
  if (!isObject(source)) return source;
  if (hash.has(source)) return hash.get(source); // 新增代码，查哈希表

  var target = Array.isArray(source) ? [] : {};
  hash.set(source, target); // 新增代码，哈希表设值

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep3(source[key], hash); // 新增代码，传入哈希表
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

### 2. 使用数组

这里使用了 ES6 中的 Map 来处理，那在 ES5 下应该如何处理呢

也很简单，使用数组来处理就好啦，代码如下。

```ts
function cloneDeep3(source, uniqueList) {
  if (!isObject(source)) return source;
  if (!uniqueList) uniqueList = []; // 新增代码，初始化数组

  var target = Array.isArray(source) ? [] : {};

  // ============= 新增代码
  // 数据已经存在，返回保存的数据
  var uniqueData = find(uniqueList, source);
  if (uniqueData) {
    return uniqueData.target;
  }

  // 数据不存在，保存源数据，以及对应的引用
  uniqueList.push({
    source: source,
    target: target,
  });
  // =============

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep3(source[key], uniqueList); // 新增代码，传入数组
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// 新增方法，用于查找
function find(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }
  return null;
}

// 用上面测试用例已测试通过
```

现在已经很完美的解决了循环引用这种情况，那其实还是一种情况是引用丢失，我们看下面的例子。

## 引用丢失

现在已经很完美的解决了循环引用这种情况，那其实还是一种情况是引用丢失，我们看下面的例子。

```ts
var obj1 = {};
var obj2 = { a: obj1, b: obj1 };

obj2.a === obj2.b;
// true

var obj3 = cloneDeep2(obj2);
obj3.a === obj3.b;
// false
```

引用丢失在某些情况下是有问题的，比如上面的对象 obj2，obj2 的键值 a 和 b 同时引用了同一个对象 obj1，使用 cloneDeep2 进行深拷贝后就丢失了引用关系变成了两个不同的对象，那如何处理呢。

其实你有没有发现，我们的 cloneDeep3 已经解决了这个问题，因为只要存储已拷贝过的对象就可以了。

```ts
var obj3 = cloneDeep3(obj2);
obj3.a === obj3.b;
// true
```

## 拷贝 Symbol

当然可以，不过 Symbol 在 ES6 下才有，我们需要一些方法来检测出 Symble 类型。

### 方法一：Object.getOwnPropertySymbols(...)

可以查找一个给定对象的符号属性时返回一个 symbol 类型的数组。注意，每个初始化的对象都是没有自己的 symbol 属性的，因此这个数组可能为空，除非你已经在对象上设置了 symbol 属性。（来自 MDN）

```ts
var obj = {};
var a = Symbol('a'); // 创建新的symbol类型
var b = Symbol.for('b'); // 从全局的symbol注册表设置和取得symbol

obj[a] = 'localSymbol';
obj[b] = 'globalSymbol';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols.length); // 2
console.log(objectSymbols); // [Symbol(a), Symbol(b)]
console.log(objectSymbols[0]); // Symbol(a)
```

思路就是先查找有没有 Symbol 属性，如果查找到则先遍历处理 Symbol 情况，然后再处理正常情况，多出来的逻辑就是下面的新增代码。

```ts
function cloneDeep4(source, hash = new WeakMap()) {
  if (!isObject(source)) return source;
  if (hash.has(source)) return hash.get(source);

  let target = Array.isArray(source) ? [] : {};
  hash.set(source, target);

  // ============= 新增代码
  let symKeys = Object.getOwnPropertySymbols(source); // 查找
  if (symKeys.length) {
    // 查找成功
    symKeys.forEach((symKey) => {
      if (isObject(source[symKey])) {
        target[symKey] = cloneDeep4(source[symKey], hash);
      } else {
        target[symKey] = source[symKey];
      }
    });
  }
  // =============

  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep4(source[key], hash);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

### 方法二：Reflect.ownKeys(...)

返回一个由目标对象自身的属性键组成的数组。它的返回值等同于 Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))。(来自 MDN)

```ts
Reflect.ownKeys({ z: 3, y: 2, x: 1 }); // [ "z", "y", "x" ]
Reflect.ownKeys([]); // ["length"]

var sym = Symbol.for('comet');
var sym2 = Symbol.for('meteor');
var obj = {
  [sym]: 0,
  str: 0,
  '773': 0,
  '0': 0,
  [sym2]: 0,
  '-1': 0,
  '8': 0,
  'second str': 0,
};
Reflect.ownKeys(obj);
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
// 注意顺序
// Indexes in numeric order,
// strings in insertion order,
// symbols in insertion order
```

我们直接用它代替 for in 和 hasOwnProperty 判断

```ts
function cloneDeep4(source, hash = new WeakMap()) {
  if (!isObject(source)) return source;
  if (hash.has(source)) return hash.get(source);

  let target = Array.isArray(source) ? [] : {};
  hash.set(source, target);

  Reflect.ownKeys(source).forEach((key) => {
    // 改动
    if (isObject(source[key])) {
      target[key] = cloneDeep4(source[key], hash);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

// 测试已通过
```

这里使用了 Reflect.ownKeys() 获取所有的键值，同时包括 Symbol，对 source 遍历赋值即可。

## 破解递归爆栈

上面四步使用的都是递归方法，但是有一个问题在于会爆栈，错误提示如下。

```ts
// RangeError: Maximum call stack size exceeded
```

那应该如何解决呢？把深度优先的递归改成广度优先的循环就可以了

```ts
function cloneDeep5(x) {
  const root = {};

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ];

  while (loopList.length) {
    // 广度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}
```

## 参考资源

- [面试题之如何实现一个深拷贝](https://muyiy.cn/blog/4/4.3.html)
