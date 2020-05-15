// t.js

const { a, b } = require('./m');

console.log(a, b.v);

setTimeout(() => {
  console.log(a, b.v);
}, 3000);
