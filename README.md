# SQ &nbsp; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tolerance-go/sq/blob/master/LICENSE) [![CircleCI Status](https://circleci.com/gh/tolerance-go/sq.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/tolerance-go/sq) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tolerance-go/sq/pulls)

[HOME](http://47.92.70.143:8000)

用结构化的问题建立自己的领域知识体系，不断提高认知水平和解决问题的能力

## Useful

假设包管理器使用的是 `yarn`

在 `docs` 目录下的一级目录作为文档大分类，一级目录下必须存在 `README.md`，在一级目录下可以新建内容，层级不限，内容也是需要用文件夹形式创建，并且新建 `main.md` 入口文件，最后执行如下命令开启本地预览

```bash
yarn dev
yarn dev:watch // 同时监听文件，自动执行 yarn generate
```

侧边栏导航根据文档结构自动生成，执行命令如下

```bash
yarn generate
```

## Helper

除了撰写文档，可能还需要 demo 或测试帮助完善内容

### Visual

使用 `parcel`，可以方便引入各种资源构建视图，在 `docs` 目录下，新建 `*.html` 文件，执行如下命令

```bash
yarn dev:visual
```

### Service

使用 `Koa`，可以方便生成所需接口，在 `docs` 目录下，新建 `*.service.ts` 文件，执行如下命令

```bash
yarn dev:server
yarn dev:server:watch // 同时监听文件自动生成在线 swagger 文档，访问 /api-playground
```

### Test

使用 `Jest`，快速执行测试用例，在 `docs` 目录下，新建 `*.test.ts` 文件，执行如下命令

```bash
yarn test
```
