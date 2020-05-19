import fn from './index';
import { getList } from 'utils/utils';

test('6-Z字形变换', () => {
  expect(fn('PAYPALISHIRING', 3)).toStrictEqual('PAHNAPLSIIGYIR');
});
