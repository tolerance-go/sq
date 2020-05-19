import fn from './index';
import { getList } from 'utils/utils';

test('5-最长回文子串', () => {
  expect(fn('babad')).toStrictEqual('bab');
});
