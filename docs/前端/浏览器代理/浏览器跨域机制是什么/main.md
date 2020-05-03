# 浏览器跨域机制是什么

## 什么是跨域

不满足同源策略就会产生跨域

> 同源策略：是指协议，域名，端口都要相同的资源地址

不同二级域名也属于跨域

## 为什么会出现跨域

为了安全的考虑，防止网站数据的外部入侵

## 跨域受限制的场景有哪些

- DOM 同源策略：禁止对不同源页面 DOM 进行操作。这里主要场景是 iframe 跨域的情况，不同域名的 iframe 是限制互相访问的

- ajax 同源策略：禁止使用 XHR 对象向不同源的服务器地址发起 HTTP 请求。

- 代理资源同源策略：禁止对不同源的代理缓存数据进行操作，比如 Cookie，LocalStorage 等无法读写

## 如何解决跨域问题

1. [后端服务器 CORS（跨域资源共享）](http://www.ruanyifeng.com/blog/2016/04/cors.html)

   CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）。

   它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。

   CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE 浏览器不能低于 IE10。

   整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

   因此，实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨源通信。

   注意：

   1. withCredentials 需要前后端配合才能正确发送 cookie 信息

      响应头

      ```bash
      Access-Control-Allow-Credentials: true
      ```

      ajax

      ```js
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      ```

      需要注意的是，如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨源）原网页代码中的 document.cookie 也无法读取服务器域名下的 Cookie。

   2. 非简单请求会发送 OPTIONS 请求，响应头字段 Access-Control-Max-Age 可以设置过期时间

      该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是 20 天（1728000 秒），即允许缓存该条回应 1728000 秒（即 20 天），在此期间，不用发出另一条预检请求。

   3. 服务器通知 origin 不在白名单内会触发 onerror，而不是通过状态码识别

      如果 Origin 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含 Access-Control-Allow-Origin 字段（详见下文），就知道出错了，从而抛出一个错误，被 XMLHttpRequest 的 onerror 回调函数捕获。注意，这种错误无法通过状态码识别，因为 HTTP 回应的状态码有可能是 200。

   4. 响应头字段 Access-Control-Expose-Headers

      该字段可选。CORS 请求时，XMLHttpRequest 对象的 getResponseHeader()方法只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回 FooBar 字段的值。

2. 服务器反向代理

   跨域原理： 同源策略是浏览器的安全策略，不是 HTTP 协议的一部分。服务器端调用 HTTP 接口只是使用 HTTP 协议，不会执行 JS 脚本，不需要同源策略，也就不存在跨越问题。

   实现思路：通过 nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 cookie 中 domain 信息，方便当前域 cookie 写入，实现跨域登录。

3. JSONP

   核心思想：浏览器的 script、img、iframe 标签是不受同源策略限制的 ，所以通过 script 标签引入一个 js 文件，这个 js 文件载入成功后会执行我们在 url 参数中指定的 callback 函数，并把把我们需要的 json 数据作为参数传入。在服务器端，当 req.params 参数中带有 callback 属性时，则把数据作为 callback 的参数执行，并拼接成一个字符串后返回。

   - 优点：兼容性好，在很古老的浏览器中也可以用，简单易用，支持浏览器与服务器双向通信。
   - 缺点：只支持 GET 请求，且只支持跨域 HTTP 请求这种情况（不支持 HTTPS）

4. 同主域下，修改 document.domain

   此方案仅限主域相同，子域不同的跨域应用场景(网页一级域名相同，只是二级域名不同)。实现原理：两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域。

   父窗口：www.a.com/a.html

   ```html
   <iframe id="iframe" src="http://child.a.com/b.html"></iframe>
   <script>
     document.domain = 'a.com';
     var user = 'admin';
   </script>
   ```

   child.a.com/b.html

   ```html
   <script>
     document.domain = 'a.com';
     // 获取父窗口中变量
     alert('get js data from parent ---> ' + window.parent.user);
   </script>
   ```

5. document.hash + iframe

   实现原理： a 与 b 跨域相互通信，通过中间页 c 来实现(且 c 与 a 是同域)。 三个页面，不同域之间利用 iframe 的 location.hash 传值，相同域之间直接 js 访问来通信。

   具体实现：a 嵌套一个 b，a 和 b 不同域名，a 可以通过修改 b 的 iframe hash 来实现对子 iframe b 的传递信息，b 如果要传递信息给 a，则需要借助一个和 a 同域的 iframe 子节点，同样使用 hash 方式传递信息，假设 b 中这个和 a 同域的子 iframe 为 c，c 在接收到信息后，可以直接调用 parent.parent 拿到 a 的接口，这样就实现了 a 和 b 这 2 个不同域的互相通信

   www.a.com/a.html

   ```html
   <iframe
     id="iframe"
     src="http://www.b.com/b.html"
     style="display:none;"
   ></iframe>
   <script>
     var iframe = document.getElementById('iframe');

     // 向b.html传hash值
     setTimeout(function () {
       iframe.src = iframe.src + '#user=admin';
     }, 1000);

     // 开放给同域c.html的回调方法
     function onCallback(res) {
       alert('data from c.html ---> ' + res);
     }
   </script>
   ```

   www.b.com/b.html

   ```html
   <iframe
     id="iframe"
     src="http://www.a.com/c.html"
     style="display:none;"
   ></iframe>
   <script>
     var iframe = document.getElementById('iframe');

     // 监听a.html传来的hash值，再传给c.html
     window.onhashchange = function () {
       iframe.src = iframe.src + location.hash;
     };
   </script>
   ```

   www.a.com/c.html

   ```html
   <script>
     // 监听b.html传来的hash值
     window.onhashchange = function () {
       // 再通过操作同域a.html的js回调，将结果传回
       window.parent.parent.onCallback(
         'hello: ' + location.hash.replace('#user=', ''),
       );
     };
   </script>
   ```

6. window.name + iframe

   浏览器窗口有 window.name 属性。只要在同一个窗口里，前一个网页设置了这个属性，后一个网页可以读取它。并且可以支持非常长的 name 值（2MB）。

   父窗口先打开一个子窗口，载入一个不同源的网页，该网页将信息写入 window.name 属性。

   ```js
   window.name = data;
   ```

   接着，子窗口跳回一个与主窗口同域的网址。

   ```js
   location = 'http://parent.url.com/xxx.html';
   ```

   然后，主窗口就可以读取子窗口的 window.name 了。

   ```js
   var data = document.getElementById('myFrame').contentWindow.name;
   ```

   这种方法的优点是，window.name 容量很大，可以放置非常长的字符串；缺点是必须监听子窗口 window.name 属性的变化，影响网页性能。

   a.html (www.a.com/a.html)

   ```js
   var proxy = function(url, callback) {
   var state = 0;
   var iframe = document.createElement('iframe');

   // 加载跨域页面
   iframe.src = url;

   // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
   iframe.onload = function() {
       if (state === 1) {
           // 第2次onload(同域c页)成功后，读取同域window.name中数据
           callback(iframe.contentWindow.name);
           destoryFrame();

       } else if (state === 0) {
           // 第1次onload(跨域页)成功后，切换到同域代理页面
           iframe.contentWindow.location = 'http://www.a.com/c.html';
           state = 1;
       }
   };

   document.body.appendChild(iframe);

   // 获取数据以后销毁这个iframe，释放内存；这也保证了安全（不被其他域frame js访问）
   function destoryFrame() {
       iframe.contentWindow.document.write('');
       iframe.contentWindow.close();
       document.body.removeChild(iframe);
   }

   };

   // 请求跨域 b 页面数据
   proxy('http://www.b.com/b.html', function(data){
   alert(data);
   ```

   c.html (www.a.com/c.html)

   中间代理页，与 a.html 同域，内容为空即可。

   b.html (www.b.com/b.html)

   ```html
   <script>
       window.name = 'This is b.html data!';
   <script>
   ```

7. postMessage

   HTML5 为了解决这个问题，引入了一个全新的 API：跨文档通信 API（Cross-document messaging）。

   这个 API 为 window 对象新增了一个 window.postMessage 方法，允许跨窗口通信，不论这两个窗口是否同源。

   postMessage 方法的第一个参数是具体的信息内容，第二个参数是接收消息的窗口的源（origin），即"协议 + 域名 + 端口"。也可以设为\*，表示不限制域名，向所有窗口发送。它可用于解决以下方面的问题：

   - 页面和其打开的新窗口的数据传递
   - 多窗口之间消息传递
   - 页面与嵌套的 iframe 消息传递
   - 上面三个场景的跨域数据传

   message 事件的事件对象 event，提供以下三个属性。

   event.source：发送消息的窗口 event.origin: 消息发向的网址 event.data: 消息内容

8. WebSocket

   WebSocket protocol 是 HTML5 一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是 server push 技术的一种很好的实现。 WebSocket 是一种通信协议，使用 ws://（非加密）和 wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

   原生 WebSocket API 使用起来不太方便，可以使用 Socket.io，它很好地封装了 webSocket 接口，提供了更简单、灵活的接口，也对不支持 webSocket 的浏览器提供了向下兼容。本此因为是模拟就没有安装了用了 WebSocket

9. image.src

   因为在浏览器中，JS 脚本和图片是可以跨域的，所以我们可以直接新建一个图片对象，然后在地址中存放一些简单，这种方法只支持 get 请求，且只能单向地向服务器发送请求，在统计广告曝光次数中比较常见。
