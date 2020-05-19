import fn from './index';

test('1-两数之和', () => {
  expect(fn([2, 7, 11, 15], 9)).toStrictEqual([0, 1]);
});
