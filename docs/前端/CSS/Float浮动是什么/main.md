# Float 浮动是什么

## 介绍

### 历史

浮动属性产生之初是为了实现“文字环绕”的效果，让文字环绕图片在网页实现类似 word 中“图文混排”。

## 特性

### 1. 包裹性

宽度 auto 的容器元素，设置浮动后，宽度会塌陷到 content 的大小

### 2. 脱离文档流

浮动让元素脱离正常流，在容器的内容区域，向容器的左侧或者右侧移动。

如果一行存在 block 类型元素，则浮动元素会进入下一行

如果一行存在多个 float 元素且的空间不够，后面的 float 元素会自动换行

<Visual relative="./views/index2.html" />

<!-- prettier-ignore -->
<<< @/docs/前端/CSS/Float浮动是什么/views/index2.html

多个浮动元素按照标记声明顺序排序，文本和行内元素会跟在后面

<Visual relative="./views/index3.html" />

<!-- prettier-ignore -->
<<< @/docs/前端/CSS/Float浮动是什么/views/index3.html

### 3. 修改 display 属性

- none -> none
- block -> block
- inline -> block
- inline-block -> block
- list-item -> list-item
- run-in -> list-item
- compact -> list-item
- marker -> list-item
- table -> table
- inline-table -> table
- table-row-group -> block
- table-header-group -> block
- table-footer-group -> block
- table-row -> block
- table-column-group -> block
- table-column -> block
- table-cell -> block
- table-caption -> block
- inherit -> block

<!-- prettier-ignore -->
<<< @/docs/前端/CSS/Float浮动是什么/views/index.html

## 清除浮动

clear 属性规定元素的哪一侧不允许有其他浮动元素。

clear 属性定义了元素的哪边上不允许出现浮动元素。在 CSS1 和 CSS2 中，这是通过自动为清除元素（即设置了 clear 属性的元素）增加上外边距实现的。在 CSS2.1 中，会在元素上外边距之上增加清除空间，而外边距本身并不改变。不论哪一种改变，最终结果都一样，如果声明为左边或右边清除，会使元素的上外边框边界刚好在该边上浮动元素的下外边距边界之下。

可以让浮动元素的高度撑开容器高度

示例代码中，在容器内追加占位元素，设置不允许左侧出现浮动，按照上述原理，占位元素上边会出现在浮动元素下边之下，而占位元素本身是处于文档流中的，因此撑开了容器高度，将 float 也算在内，否则就像示例 2 一样，2 个浮动元素上下摆放，但是不会撑开

示例 1:

<Visual relative="./views/index4.html" />

<!-- prettier-ignore -->
<<< @/docs/前端/CSS/Float浮动是什么/views/index4.html

示例 2:

<Visual relative="./views/index5.html" />

<!-- prettier-ignore -->
<<< @/docs/前端/CSS/Float浮动是什么/views/index5.html

## 参考资源

- [CSS clear 属性](https://www.w3school.com.cn/cssref/pr_class_clear.asp)
- [深入理解 css 浮动](https://www.cnblogs.com/starof/p/4608962.html)
