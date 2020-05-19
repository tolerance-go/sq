const reverse = (x) => {
  let res = 0;
  const min = Math.pow(-2, 31);
  const max = Math.pow(2, 31) - 1;
  while (x) {
    const num = x % 10;
    x = Math.trunc(x / 10);

    if (!((min - num) / 10 <= res && res <= (max - num) / 10)) {
      return 0;
    }
    res = res * 10 + num;
  }
  return res;
};

export default reverse;
