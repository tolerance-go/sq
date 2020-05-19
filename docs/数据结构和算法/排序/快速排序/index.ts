const partition = (arr, left, right) => {
  const pivot = arr[left];
  while (left < right) {
    while (left < right && arr[right] > pivot) {
      --right;
    }
    arr[left] = arr[right];
    while (left < right && arr[left] <= pivot) {
      ++left;
    }
    arr[right] = arr[left];
  }
  arr[left] = pivot;
  return left;
};

const sort = (arr, left = 0, right = arr.length - 1) => {
  if (left < right) {
    const mid = partition(arr, left, right);
    sort(arr, left, mid - 1);
    sort(arr, mid + 1, right);
  }
  return arr;
};

export default sort;
