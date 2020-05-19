const maxArea = (height) => {
  let left = 0,
    right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    maxArea = Math.max(
      Math.min(height[left], height[right]) * (right - left),
      maxArea,
    );
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
};

export default maxArea;
