# TailwindCSS 解决的问题是什么

## 高度可定制，增加灵活性

> 大多数 CSS 框架做得太多。它们带有各种预先设计的组件，例如按钮，卡片和警报，它们一开始可能会帮助您快速移动，但是当使您的网站以自定义设计脱颖而出时，它们所带来的痛苦大于治愈的痛苦。

原子 CSS 抽象

Tailwind CSS 定义了一批原子级的 CSS 类，作为高度可定制的低级框架，可以为开发者提供构建定制设计所需的所有构建基块，而不用再手写 CSS 样式

## 定制化设计 UI 系统

如果可以自定义有意义，则可以使用 Tailwind 对其进行自定义。这包括颜色，边框大小，字体粗细，间距实用程序，断点，阴影以及更多其他内容。

Tailwind 用 PostCSS 编写并用 JavaScript 配置，这意味着您唾手可得真正的编程语言的全部功能。

Tailwind 不仅是 CSS 框架，还是创建设计系统的引擎。

```ts
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      tablet: '768px',
      desktop: '1024px',
    },
    colors: {
      primary: {
        100: '#ebf8ff',
        300: '#90cdf4',
        500: '#4299e1',
        700: '#2b6cb0',
        900: '#2a4365',
      },
      secondary: {
        100: '#fffff0',
        300: '#faf089',
        500: '#ecc94b',
        700: '#b7791f',
        900: '#744210',
      },
    },
    extend: {
      boxShadow: {
        huge: '0 30px 60px -15px rgba(0, 0, 0, .25)',
      },
    },
  },
};
```

## 参考资源

- [TailwindCSS 官网](https://tailwindcss.com/)
