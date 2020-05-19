import fn from './index';
import { getList } from 'utils/utils';

test('3-无重复字符的最长子串', () => {
  expect(fn('aab')).toStrictEqual(2);
});
