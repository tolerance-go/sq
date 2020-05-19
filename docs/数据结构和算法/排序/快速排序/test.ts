import fn from './index';

test('快速排序', () => {
  expect(fn([1, 4, 2, 3])).toStrictEqual([1, 2, 3, 4]);
});
