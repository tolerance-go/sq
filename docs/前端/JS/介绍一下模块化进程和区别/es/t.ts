// t.ts

import { a, b } from './m';

console.log(a, b.v);

setTimeout(() => {
  console.log(a, b.v);
}, 3000);
