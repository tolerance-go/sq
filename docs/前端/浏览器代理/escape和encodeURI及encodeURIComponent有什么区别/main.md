# escape 和 encodeURI 及 encodeURIComponent 有什么区别

- escape：是对字符串(string)进行编码，ASCII 字母、数字、@\*/+ ，这几个字符不会被编码，其余的都会

- encodeURI：是对 URL 进行编码，不会对 ASCII 字母、数字、~!@#\$&\*()=:/,;?+' 进行编码

- encodeURIComponent：是对 URL 进行编码，不会对 ASCII 字母、数字、~!\*()' 进行编码

## 参考资源

- [简单明了区分 escape、encodeURI 和 encodeURIComponent](https://www.cnblogs.com/season-huang/p/3439277.html)
