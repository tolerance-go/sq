# 内存泄漏如何避免

## 意外的全局变量

未定义的变量会在全局对象创建一个新变量，如下。

```ts
function foo(arg) {
  bar = 'this is a hidden global variable';
}
```

函数 foo 内部忘记使用 var ，实际上 JS 会把 bar 挂载到全局对象上，意外创建一个全局变量。

```ts
function foo(arg) {
  window.bar = 'this is an explicit global variable';
}
```

另一个意外的全局变量可能由 this 创建。

```ts
function foo() {
  this.variable = 'potential accidental global';
}

// Foo 调用自己，this 指向了全局对象（window）
// 而不是 undefined
foo();
```

### 解决方法

在 JavaScript 文件头部加上 'use strict'，使用严格模式避免意外的全局变量，此时上例中的 this 指向 undefined。如果必须使用全局变量存储大量数据时，确保用完以后把它设置为 null 或者重新定义。

## 被遗忘的计时器或回调函数

计时器 setInterval 代码很常见

```ts
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        // 处理 node 和 someResource
        node.innerHTML = JSON.stringify(someResource));
    }
}, 1000);
```

上面的例子表明，在节点 node 或者数据不再需要时，定时器依旧指向这些数据。所以哪怕当 node 节点被移除后，interval 仍旧存活并且垃圾回收器没办法回收，它的依赖也没办法被回收，除非终止定时器。

```ts
var element = document.getElementById('button');
function onClick(event) {
  element.innerHTML = 'text';
}

element.addEventListener('click', onClick);
```

对于上面观察者的例子，一旦它们不再需要（或者关联的对象变成不可达），明确地移除它们非常重要。老的 IE 6 是无法处理循环引用的。因为老版本的 IE 是无法检测 DOM 节点与 JavaScript 代码之间的循环引用，会导致内存泄漏。

但是，现代的浏览器（包括 IE 和 Microsoft Edge）使用了更先进的垃圾回收算法（标记清除），已经可以正确检测和处理循环引用了。即回收节点内存时，不必非要调用 removeEventListener 了。

## 脱离 DOM 的引用

如果把 DOM 存成字典（JSON 键值对）或者数组，此时，同样的 DOM 元素存在两个引用：一个在 DOM 树中，另一个在字典中。那么将来需要把两个引用都清除。

```ts
var elements = {
  button: document.getElementById('button'),
  image: document.getElementById('image'),
  text: document.getElementById('text'),
};
function doStuff() {
  image.src = 'http://some.url/image';
  button.click();
  console.log(text.innerHTML);
  // 更多逻辑
}
function removeButton() {
  // 按钮是 body 的后代元素
  document.body.removeChild(document.getElementById('button'));
  // 此时，仍旧存在一个全局的 #button 的引用
  // elements 字典。button 元素仍旧在内存中，不能被 GC 回收。
}
```

如果代码中保存了表格某一个 `<td>` 的引用。将来决定删除整个表格的时候，直觉认为 GC 会回收除了已保存的 `<td>` 以外的其它节点。实际情况并非如此：此 `<td>` 是表格的子节点，子元素与父元素存在上下引用关系。由于代码保留了 `<td>` 的引用，导致整个表格仍待在内存中。所以保存 DOM 元素引用的时候，要小心谨慎。

## 闭包

闭包是一种有权访问外部作用域内的变量的函数

内部函数 被 外部函数 包含时，内部函数会将外部函数的局部活动对象添加到自己的作用域链中

```ts
outerFun(outerArgument){
    //被包含的内部函数可以访问外部函数的变量
    return function(){
        return outerArgument+1
    }
}

// 创建函数 还未调用
var creatFun = outerFun(7)
// 调用函数
var result = creatFun(8)
```

而由于内部匿名函数的作用域链 在引用 外部包含函数的活动对象 ，即使 outFun 执行完毕了，它的活动对象还是不会被销毁，我们只需要将外部指向匿名函数执行环境对象的引用清空就可以等待下次垃圾回收正确释放

```ts
// 解除对匿名函数的引用
creatFun = null;
```

## 参考资源

- [JavaScript 深入之 4 类常见内存泄漏及如何避免](https://muyiy.cn/blog/1/1.5.html)
- [闭包为什么会造成内存泄漏？](https://blog.csdn.net/u013545737/article/details/88323872)


