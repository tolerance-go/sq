import { ListNode } from 'utils/utils';

const addTwoNumbers = (l1, l2) => {
  const dummy = new ListNode(-1);
  let current = dummy;
  let carry = 0;
  while (l1 != null || l2 != null) {
    const num1 = l1 ? l1.val : 0;
    const num2 = l2 ? l2.val : 0;
    const sum = num1 + num2 + carry;
    carry = Math.trunc(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  if (carry) {
    current.next = new ListNode(1);
  }
  return dummy.next;
};

export default addTwoNumbers;
