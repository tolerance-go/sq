# 如何实现一个无限累加的函数 add

## 题目要求

```ts
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10

// 以此类推
```

## 实现

这里返回的类型是一个函数，利用闭包实现累加计算，同时重写 toString 原型方法，打印结果

```ts
function add(a) {
	function sum(b) { // 使用闭包
    	a = a + b; // 累加
    	return sum;
 	}
 	sum.toString = function() { // 重写toString()方法
        return a;
    }
 	return sum; // 返回一个函数
}

add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10
```

<br/>
<br/>
<br/>
<ContributorsList />
<br/>
<br/>
<br/>
<Vssue :title="$title" />
