# URI 和 URL 及 URN 之间有什么区别

## URI

是 uniform resource identifier，统一资源标识符，用来唯一的标识一个资源。

Web 上可用的每种资源如 HTML 文档、图像、视频片段、程序等都是一个来 URI 来定位的 URI 一般由三部组成： ① 访问资源的命名机制 ② 存放资源的主机名 ③ 资源自身的名称，由路径表示，着重强调于资源。

## URL

是 uniform resource locator，统一资源定位器，它是一种具体的 URI，即 URL 可以用来标识一个资源，而且还指明了如何 locate 这个资源。

URL 是 Internet 上用来描述信息资源的字符串，主要用在各种 WWW 客户程序和服务器程序上，特别是著名的 Mosaic。采用 URL 可以用一种统一的格式来描述各种信息资源，包括文件、服务器的地址和目录等。URL 一般由三部组成： ① 协议(或称为服务方式) ② 存有该资源的主机 IP 地址(有时也包括端口号) ③ 主机资源的具体地址。如目录和文件名等

## URN

uniform resource name，统一资源命名，是通过名字来标识资源，比如mailto:java-net@java.sun.com。

URI 是以一种抽象的，高层次概念定义统一资源标识，而 URL 和 URN 则是具体的资源标识的方式。URL 和 URN 都是一种 URI。笼统地说，每个 URL 都是 URI，但不一定每个 URI 都是 URL。这是因为 URI 还包括一个子类，即统一资源名称 (URN)，它命名资源但不指定如何定位资源。上面的 mailto、news 和 isbn URI 都是 URN 的示例。

## 参考资源

- [https 工作原理](https://blog.csdn.net/sean_cd/article/details/6966130)
