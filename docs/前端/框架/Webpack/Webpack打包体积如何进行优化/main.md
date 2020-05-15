# Webpack 打包体积如何进行优化

## 1. 按需加载

babel-import-plugin lodash 按需加载

mini-css-extract-plugin 提取 css

## 2. 图片压缩

使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)配置 image-webpack-loader

## 3. 提取页面公共资源

基础包分离：

使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4 内置) ，替代了 CommonsChunkPlugin 插件

## 4. Tree shaking

打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的 bundle 中去掉(只能对 ES6 Modlue 生效) 开发中尽可能使用 ES6 Module 的模块，提高 tree shaking 效率禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码

purgecss-webpack-plugin 和 mini-css-extract-plugin 配合使用(建议)

## 5. Scope hoisting

构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突必须是 ES6 的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法

## 6. 按需 Polyfill

建议采用 polyfill-service 只给用户返回需要的 polyfill，社区维护。 (部分国内奇葩浏览器 UA 可能无法识别，但可以降级返回所需全部 polyfill)

@baebl/polyfill 按需加载

## 参考资源

- [webpack 打包原理 ? 看完这篇你就懂了 !](https://zhuanlan.zhihu.com/p/101541041)
