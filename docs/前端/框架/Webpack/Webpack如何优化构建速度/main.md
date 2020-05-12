# Webpack 如何优化构建速度

## 1. 使用高版本

使用高版本的 Webpack 和 Node.js

## 2. 多进程/多实例构建

HappyPack(不维护了)、thread-loader

## 3. 多进程并行压缩

webpack-paralle-uglify-plugin uglifyjs-webpack-plugin 开启 parallel 参数 (不支持 ES6) terser-webpack-plugin 开启 parallel 参数

## 4. 缩小打包范围

exclude/include (确定 loader 规则范围)

resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)

resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)

resolve.extensions 尽可能减少后缀尝试的可能性

noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)

IgnorePlugin (完全排除模块)

合理使用 alias

## 5. DLL

使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。HashedModuleIdsPlugin 可以解决模块数字 id 问题

## 6. 充分利用缓存提升二次构建速度：

babel-loader 开启缓存 terser-webpack-plugin 开启缓存使用 cache-loader 或者 hard-source-webpack-plugin

## 参考资源

- [webpack 打包原理 ? 看完这篇你就懂了 !](https://zhuanlan.zhihu.com/p/101541041)
