import fn from './index';
import { getList } from 'utils/utils';

test('2-两数相加', () => {
  expect(fn(getList([2, 4, 3]), getList([5, 6, 4]))).toStrictEqual(
    getList([7, 0, 8]),
  );
});
