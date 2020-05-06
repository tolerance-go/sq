const path = require('path');

const trimPath = (str, other) => {
  return str.replace(other, '');
};

const changePath = (str, options) => {
  const m = path.parse(str);
  if (typeof options === 'function') {
    options = options(m);
  }
  return path.format({ ...m, ...options });
};

module.exports = { trimPath, changePath };
