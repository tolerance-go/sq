const twoSum = (nums, target) => {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const curIndex = i;
    const diff = target - num;
    if (map.has(diff)) {
      return [map.get(diff), curIndex];
    }
    map.set(num, curIndex);
  }
  return [];
};

export default twoSum;
