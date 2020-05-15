# 如何实现圣杯和双飞翼布局

不管是哪种布局，都是利用 float 实现的，我们先简单了解一下 float 的特性吧

## float 特性

float 属性定义元素在哪个方向浮动。以往这个属性总应用于图像，使文本围绕在图像周围，不过在 CSS 中，任何元素都可以浮动。浮动元素会生成一个块级框，而不论它本身是何种元素。

如果浮动非替换元素，则要指定一个明确的宽度；否则，它们会尽可能地窄。

**假如在一行之上只有极少的空间可供浮动元素，那么这个元素会跳至下一行，这个过程会持续到某一行拥有足够的空间为止。**

注意上面这句话，圣杯布局的缺点就是这个原因，接下来会说明这点

## 圣杯布局

### 思路

header，container，bottom 比较简单利用文档流，宽度铺满正常换行即可

将左中右 3 块内容设为 float，**middle 放在最前面**，设置 middle 宽短为 100%，此时 left，right 被挤到下一行去了，我们通过相对位移将其重新出现在屏幕即可

### 基本步骤

#### 1. 设置基本 html 结构和 CSS

```html
<header><h4>内容区</h4></header>
<div class="container">
  <div class="middle"><h4>中间弹性区</h4></div>
  <div class="left"><h4>左边栏</h4></div>
  <div class="right"><h4>右边栏</h4></div>
</div>
<footer><h4>footer内容区</h4></footer>
```

container 设置 padding 将两侧内容空出，留给 left 和 right，避免覆盖内容

```css
header {
  width: 100%;
  height: 50px;
  background-color: red;
}
.container {
  height: 200px;
  overflow: hidden;
  padding: 0 200px; /* ! */
}
.middle {
  height: 200px;
  background-color: #aaa;
  float: left;
}
.left {
  width: 200px;
  height: 200px;
  background-color: blue;
  float: left;
}
.right {
  width: 200px;
  height: 200px;
  background-color: yellow;
  float: left;
}
footer {
  width: 100%;
  height: 50px;
  background-color: black;
}
```

<Visual relative="./views/shengbei-1.html" />

#### 2. 铺满 middle 宽度

```css
.middle {
  width: 100%; /* ! */
  height: 100px;
  background-color: #aaa;
  float: left;
}
```

为了演示，我们将 container 的 `overflow: hidden;` 暂时注释掉

```css
.container {
  height: 100px;
  /* overflow: hidden; */
  padding: 0 100px;
}
```

<Visual relative="./views/shengbei-2.html" />

#### 3. 相对移动 left 和 right

利用 margin-left 将两侧内容拉回来，注意 margin-left 为百分比是[相对于父级宽度的](../CSS样式的百分比都相对于谁/main.html)

```css
.left {
  width: 100px;
  height: 100px;
  background-color: blue;
  float: left;
  margin-left: -100%; /* ! */
}
.right {
  width: 100px;
  height: 100px;
  background-color: yellow;
  float: left;
  margin-left: -100px; /* ! */
}
```

<Visual relative="./views/shengbei-3.html" />

因为两侧宽度是预知的，最后利用 `position: relative;` 将两侧填补到空白的地方就大功告成了

```css
.left {
  width: 100px;
  height: 100px;
  background-color: blue;
  float: left;
  margin-left: -100%;
  position: relative; /* ! */
  left: -100px; /* ! */
}
.right {
  width: 100px;
  height: 100px;
  background-color: yellow;
  float: left;
  margin-left: -100px;
  position: relative; /* ! */
  right: -100px; /* ! */
}
```

<Visual relative="./views/shengbei-4.html" />

### 缺点

还记得上面说过的 float 的特性之一吗？

> 假如在一行之上只有极少的空间可供浮动元素，那么这个元素会跳至下一行，这个过程会持续到某一行拥有足够的空间为止。

如果屏幕宽度过小，导致 container 内容的宽度无法装下侧边栏区域时候，就会换行，直接效果就是两侧消失了

<Visual relative="./views/shengbei-5.html" />

解决方法就是给页面设置一个最小宽度，或者使用使用下面介绍的 双飞翼 方案

## 双飞翼布局

此布局和圣杯非常相似，区别在于需要在 mddile 内插入一个 inner 节点，这个节点的目的和 container 的 padding 一样都是撑开两侧留白用的

```html
<div class="container">
  <div class="middle">
    <!-- ! -->
    <div class="inner"><h4>中间弹性区</h4></div>
    <!-- ! -->
  </div>
  <div class="left"><h4>左边栏</h4></div>
  <div class="right"><h4>右边栏</h4></div>
</div>
```

```css
.inner {
  padding: 0 100px 0 100px;
}
```

那么侧边栏操作就省去了 `position: relative;` 的相对移动，因为父容器宽度此时为整个屏幕宽度

看效果：

<Visual relative="./views/shuangfeiyi.html" />

### 优点

相对于圣杯布局，它对最小内容宽度的限制放松了，只要屏幕宽度不小于最小单个侧边内容宽度，两侧就不会消失

<Visual relative="./views/shuangfeiyi-1.html" />

## 总结

1. 圣杯布局和双飞翼布局都是通过 float 属性实现的

2. 双飞翼布局对屏幕宽度要求更低，实用性更高

   1. 双飞翼布局对屏幕宽度的限制为 屏幕宽度 >= 最小侧边栏宽度
   2. 圣杯布局对屏幕宽度的限制为 (屏幕宽度 - 侧边栏宽度总和) >= 最小侧边栏宽度

## 参考资源

- [CSS 布局 -- 圣杯布局 & 双飞翼布局](https://zhuanlan.zhihu.com/p/46091444)
