// m.js

let a = 'a';
const b = { v: 1 };

setTimeout(() => {
  b.v = 2;
  a = 'a+';
}, 1000);

module.exports = { b, a };
