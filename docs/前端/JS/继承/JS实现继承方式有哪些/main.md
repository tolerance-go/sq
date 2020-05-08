# JS 实现继承方式有哪些

## 1. 原型链继承

```js
// 父类
function Animal(name) {
  this.name = name;
  this.eat = () => console.log('eat');
}
// 子类
function Dog(name) {
  this.name = name;
  this.maimeng = true;
}
Dog.prototype = new Animal();

const dog = new Dog();

console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog); // true

// 动态扩展原型
// Animal.prototype = ...
```

优点：

- 父子实例原型链完整
- 父类可以动态扩展原型，子类实例立即可以共享

缺点：

- 无法实现多重继承
- 构造子类，无法向父类构造函数传参

## 2. 构造继承

```js
// 父类
function Animal(name) {
  this.name = name;
  this.eat = () => console.log('eat');
}
// 子类
function Dog(name) {
  Animal.call(this, name);
  this.maimeng = true;
}

const dog = new Dog();

console.log(dog instanceof Animal); // false
console.log(dog instanceof Dog); // true
```

优点：

- 构建子类的时候，可以向父类构造函数传参
- 可以实现多重继承（构造函数内部多 call 几次）

缺点：

- 父子实例原型链关系断裂
- 无法继承父类原型属性

## 3. 实例继承

```js
// 父类
function Animal(name) {
  this.name = name;
  this.eat = () => console.log('eat');
}
// 子类
function Dog(name) {
  const instance = new Animal(name);
  instance.maimeng = true;
  return instance;
}

const dog = new Dog();

console.log(dog instanceof Animal); // false
console.log(dog instanceof Dog); // true
```

优点：

- 继承 `构造继承` 优点
- 构建子类实例可以缺省 new（emmm）

缺点：

- 继承 `构造继承` 缺点
- 但是可以继承父类原型属性

## 4. 组合继承

```js
// 父类
function Animal(name) {
  this.name = name;
  this.eat = () => console.log('eat');
}
// 子类
function Dog(name) {
  Animal.call(this, name);
  this.maimeng = true;
}

Dog.prototype = Object.create(Animal && Animal.prototype);
// 注意修改构造器指向
Dog.prototype.constructor = Dog;

const dog = new Dog();

console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog); // true
```

优点：

- 继承 `构造继承` 和 `原型链继承` 优点

注意：不要直接使用 `Dog.prototype = Animal.prototype;`，这样修改子类原型对时候会污染父类原型

## 5. class

如果转成 es5 实际上是 `组合继承` 的语法糖，使用 babel 的话，一些问题转换过程中都已经修复了

```js
// 父类
class Animal {
  constructor(name) {
    this.name = name;
    this.eat = () => console.log('eat');
  }
}
// 子类
class Dog extends Animal {
  constructor(name) {
    super(name);
    this.maimeng = true;
  }
}

const dog = new Dog();

console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog); // true
```

优点：

- 继承 `构造继承` 和 `原型链继承` 优点

## 总结

1. 上述罗列 5 种继承方式，推荐使用 class 或者 组合继承的方式，集成了下述优点

   - 原型链关系完整性
   - 父类原型动态扩展性
   - 可以实现多重继承
   - 构造子类实例可以向父类构造函数传递参数

2. class 是组合继承的语法糖
