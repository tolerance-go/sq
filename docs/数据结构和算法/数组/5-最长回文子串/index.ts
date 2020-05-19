import { ListNode } from 'utils/utils';

const isPalindrome = (s) => {
  let i = 0,
    j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) {
      return false;
    }
    i++;
    j--;
  }
  return true;
};

const longestPalindrome = (s) => {
  let max = 0;
  let temp = '';
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const substr = s.substring(i, j + 1);
      if (isPalindrome(substr) && substr.length > max) {
        max = substr.length;
        temp = substr;
      }
    }
  }
  return temp;
};

export default longestPalindrome;
