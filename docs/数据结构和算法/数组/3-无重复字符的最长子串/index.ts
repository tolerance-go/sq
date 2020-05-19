import { ListNode } from 'utils/utils';

const lengthOfLongestSubstring = (s) => {
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    let curLen = 0;
    const map = new Map();
    for (let j = i; j < s.length; j++) {
      if (map.has(s[j])) {
        break;
      } else {
        map.set(s[j], true);
        curLen++;
      }
      max = Math.max(curLen, max);
    }
  }
  return max;
};

export default lengthOfLongestSubstring;
