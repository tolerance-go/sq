# SQ &nbsp; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tolerance-go/sq/blob/master/LICENSE) [![CircleCI Status](https://circleci.com/gh/tolerance-go/sq.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/tolerance-go/sq) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tolerance-go/sq/pulls)

[HOME](http://47.92.70.143)

Build your own knowledge system with structured problems

## Helper

除了撰写文档，可能还需要 demo 或测试帮助完善内容，假设包管理器使用的是 `yarn`

### Visual

使用 `parcel`，可以方便引入各种资源构建试图，在 `docs` 目录下，新建 `.html` 文件，执行如下命令

```bash
yarn dev:visual
```

### Service

使用 `Koa`，可以方便生成所需接口，在 `docs` 目录下，新建 .`service.ts` 文件，执行如下命令

```bash
yarn dev:server
yarn dev:server:watch // 同时监听文件自动生成 swagger 文档
```

### Test

使用 `Jest`，快速执行测试用例，在 `docs` 目录下，新建 `.test.ts` 文件，执行如下命令

```bash
yarn test
```
