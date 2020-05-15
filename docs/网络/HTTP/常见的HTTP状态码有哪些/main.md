# 常见的 HTTP 状态码有哪些

1XX 表示消息 2XX 表示成功 3XX 表示重定向 4XX 表示客户端错误 5XX 表示服务端错误

- 200

  最喜欢见到的状态码，表示请求成功

- 301

  永久重定向

- 302

  临时重定向

- 304

  自上次请求，未修改的文件

- 400

  错误的请求

- 401

  未被授权，需要身份验证，例如 token 信息等等

- 403

  请求被拒绝

- 404

  资源缺失，接口不存在，或请求的文件不存在等等

- 500

  服务器端的未知错误

- 502

  网关错误

- 503

  服务暂时无法使用

- 504

  上游响应超时

## http 状态码中 301，302 和 307 有什么区别

301，Moved Permanently。永久重定向，该操作比较危险，需要谨慎操作：如果设置了 301，但是一段时间后又想取消，但是浏览器中已经有了缓存，还是会重定向。

302，Fount。临时重定向，但是会在重定向的时候改变 method: 把 POST 改成 GET，于是有了 307

307，Temporary Redirect。临时重定向，在重定向时不会改变 method

## http 状态码 502 和 504 有什么区别

502 Bad Gateway The server was acting as a gateway or proxy and received an invalid response from the upstream server. 收到了上游响应但无法解析

504 Gateway Timeout The server was acting as a gateway or proxy and did not receive a timely response from the upstream server. 上游响应超时

## 参考资源

- [关于大厂面试中问到的二十几个 HTTP 面试题](https://juejin.im/post/5e015a60e51d45583d426a15)
