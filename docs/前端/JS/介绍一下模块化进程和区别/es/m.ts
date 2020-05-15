// m.ts

let a = 'a';
const b = { v: 1 };

setTimeout(() => {
  b.v = 2;
  a = 'a+';
}, 1000);

export { b, a };
