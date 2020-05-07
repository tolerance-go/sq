# CSS 样式的百分比都相对于谁

## 相对于父级宽度的

- max-width
- min-width
- width
- left
- right
- text-indent
- padding
- margin
- grid-template-columns
- grid-auto-columns
- column-gap 等

## 相对于父级高度的

- max-height
- min-height
- height
- top
- bottom
- grid-template-rows
- grid-auto-rows
- row-gap
- 等

## 相对于主轴长度的

flex-basis 等

## 相对于继承字号的

font-size

## 相对于自身字号的

line-height 等

## 相对于自身宽高的

- border-radius
- background-size
- border-image-width
- transform: translate()
- transform-origin
- zoom
- clip-path
- 等

## 相对于行高的

vertical-align 等

## 特殊算法的

- background-position

  方向长度 / 该方向除背景图之外部分总长度

- border-image-slice

  相对于图片尺寸

- position: absolute

  “父级”指：相对于离它最近的那个 position 不为 static 的祖先元素，如果没有这样的元素，则相对于视口。

- position: fixed，“父级”指视口

- filter 系列函数等
