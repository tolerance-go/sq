import { ListNode } from 'utils/utils';

const convert = (s, numRows) => {
  if (numRows === 1) return s;
  const mt = Array.from(Array(numRows), () => []);
  let step = 1;
  let rowIndex = 0;
  const arr = Array.from(s);
  while (arr.length) {
    const item = arr.shift();
    const row = mt[rowIndex];
    row.push(item);
    rowIndex += step;
    if (rowIndex > mt.length - 1) {
      rowIndex = mt.length - 2;
      step = -1;
    } else if (rowIndex < 0) {
      rowIndex = 1;
      step = 1;
    }
  }
  return mt.reduce((a, b) => a.concat(b)).join('');
};

export default convert;
