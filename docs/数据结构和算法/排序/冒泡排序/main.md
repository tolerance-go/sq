# 冒泡排序

## 分析

| 时间复杂度（平均/最好/最坏）           | 空间复杂度 | 排序方式 | 稳定性 |
| -------------------------------------- | ---------- | -------- | ------ |
| O(n<sup>2</sup>) / O(n) / O(n<sup>2</sup>) | O(1)       | In-place | 稳定   |

## 思路

比较相邻的元素，如果左侧比右侧小，调换它们的顺序，直到未处理的数组末尾，**最后一次判断是左侧的两个数字**

## 题解

1. 外层循环数组 arr，下标为 i，循环条件为 i < arr.length - 1
2. 内层循环数组 arr，下标为 j，循环条件为 j < arr.length - 1 - i
   1. 判断 arr[j] < arr[j + 1]
      1. 如果是，调换它们的顺序
      2. 如果否，继续判断下一个

## 示例

<<< @/docs/数据结构和算法/排序/冒泡排序/index.ts
