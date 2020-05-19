# http 请求什么时候会带上 cookie 信息

Set-Cookie 响应头字段（Response header）是服务器发送到浏览器或者其他客户端的一些信息，一般用于登陆成功的情况下返回给客户端的凭证信息，然后下次请求时会带上这个 cookie，这样服务器端就能知道是来自哪个用户的请求了。

Cookie 请求头字段是客户端发送请求到服务器端时发送的信息（满足一定条件下浏览器自动完成，无需前端代码辅助）。

下表为 Set-Cookie 响应头可以设置的属性

| value | desc |
| --- | --- |
| NAME=VALUE | 赋予 Cookie 的名称和其值（必需项） |
| expires=DATE | Cookie 的有效期（若不明确指定则默认为浏览器关闭前为止） |
| path=PATH | 将服务器上的文件目录作为 Cookie 的适用对象（若不指定则默 认为文档所在的文件目录） |
| domain=域名 | 作为 Cookie 适用对象的域名 （若不指定则默认为创建 Cookie 的服务器的域名） |
| Secure | 仅在 HTTPS 安全通信时才会发送 Cookie |
| HttpOnly | 加以限制， 使 Cookie 不能被 JavaScript 脚本访问 |

如果满足下面几个条件：

1、浏览器端某个 Cookie 的 domain 字段等于 aaa.www.com 或者 www.com

2、都是 http 或者 https，或者不同的情况下 Secure 属性为 false

3、要发送请求的路径，即上面的 xxxxx 跟浏览器端 Cookie 的 path 属性必须一致，或者是浏览器端 Cookie 的 path 的子目录，比如浏览器端 Cookie 的 path 为/test，那么 xxxxxxx 必须为/test 或者/test/xxxx 等子目录才可以

上面 3 个条件必须同时满足，否则该 Post 请求就不能自动带上浏览器端已存在的 Cookie

## 参考资源

- [http 请求什么时候会带上 cookie 信息](https://blog.csdn.net/john1337/article/details/104571244)
