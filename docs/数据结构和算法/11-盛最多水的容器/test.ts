import fn from './index';

test('11-盛最多水的容器', () => {
  expect(fn([1, 8, 6, 2, 5, 4, 8, 3, 7])).toStrictEqual(49);
});
