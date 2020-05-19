import fn from './index';
import { getTree } from 'utils/utils';

test(`前序遍历`, () => {
  const tree = getTree([1, null, 2, 3]);
  expect(fn(tree)).toStrictEqual([1, 2, 3]);
});
