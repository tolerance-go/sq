# HTTP

## 3. HTTP2 中 SETTINGS 帧的作用是什么 <Badge text="中等" type='warning' /> [<OutboundLink />](/网络/HTTP/HTTP2是什么/main.html)

::: details 点击查看答案

连接双方在建立连接开始时，用来互相确认配置

:::

## 2. HTTP2 中 SETTINGS 帧的 stream identifier 必须固定是什么 <Badge text="中等" type='warning' /> [<OutboundLink />](/网络/HTTP/HTTP2是什么/main.html)

::: details 点击查看答案

0x0

:::

## 1. HTTP2 中头部信息是如何被传输的 <Badge text="中等" type='warning' /> [<OutboundLink />](/网络/HTTP/HTTP2是什么/main.html)

::: details 点击查看答案

HTTP2 中，首部列表通过压缩算法序列号成首部块，然后又被划分成一个或多个叫做首部片段的字节序列，并通过 HEADERS、PUSH_PROMISE，或者 CONTINUATION 帧进行有效负载传送

:::
