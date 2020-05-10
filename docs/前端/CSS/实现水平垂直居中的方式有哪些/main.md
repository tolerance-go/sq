# 实现水平垂直居中的方式有哪些

## Flex

flex 实现还是比较简单的，只要在容器组件上设置相应属性即可

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/flex.html

运行效果如下：

<Visual relative="./views/flex.html" />

## line-height + verticle-align

父容器设置 line-height 与 text-align:center 属性，子组件设置 verticle-align:middle

子组件的 display 属性需要设置为 inline 或者 inline-block

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/line-height.html

运行效果如下：

<Visual relative="./views/line-height.html" />

## line-height + verticle-align 自适应容器高度

上个版本需要在父容器上设置 line-height，如果无法提前预设该属性，我们可以在容器内插入一个占位子组件，这样就可以自适应容器高度了

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/line-height2.html

运行效果如下：

<Visual relative="./views/line-height2.html" />

## table-cell

利用 `display: table-cell` 本身自带的垂直居中属性

父容器设置 display: table-cell 和 vertical-align: middle 实现垂直居中，子组件需要 inline 或者 inline-block 属性

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/table-cell.html

运行效果如下：

<Visual relative="./views/table-cell.html" />

## position:absolute + margin:-x

子组件设置绝对定位，top，left 各 50%，因为是[相对于父容器](/前端/CSS/CSS样式的百分比都相对于谁/main.html)，要想实现居中，还需要调整自身，将自身向上和向左各设置负的一半高和宽度，所以这种方案需要预知子组件尺寸

文本元素需要包装容器辅助实现

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/absolute.html

运行效果如下：

<Visual relative="./views/absolute.html" />

## position:absolute + margin:auto

子组件设置绝对定位，四个方向都设置为 0，margin 属性设置为 auto，这种发式好处在于不需要知道子组件具体尺寸，但是必须存在

文本元素需要包装容器辅助实现

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/absolute2.html

运行效果如下：

<Visual relative="./views/absolute2.html" />

## position:absolute + transform

和之前的方法类似，只不过调整自身是通过 transform 属性完成的，好处是不需要预知子组件尺寸，而且不用提前设置

参考代码如下：

<<< @/docs/前端/CSS/实现水平垂直居中的方式有哪些/views/absolute3.html

运行效果如下：

<Visual relative="./views/absolute3.html" />

## 结论

1. 推荐使用 flex 和 absolute + transform 实现垂直水平居中
2. text-align: center 设置在 table-cell 父容器上
3. inline 类型组件可以选用 line-height 方案，通过设置 占位元素 实现容器高度自适应
4. position:absolute（transform 除外） 方案实现文本居中需要包装容器辅助实现
