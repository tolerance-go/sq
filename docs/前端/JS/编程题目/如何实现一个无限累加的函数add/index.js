const sum = (...args) => {
  let sum = args.reduce((a, b) => a + b);
  const fn = (...args_) => {
    if (args_.length === 0) return sum;
    sum += args_.reduce((a, b) => a + b);
    return fn;
  };

  return fn;
};

console.log(sum(1, 2, 3)(4, 5)() === 15);
