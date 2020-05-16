# 1-两数之和

[原题](https://leetcode-cn.com/problems/two-sum/)

## 思路

遍历数组，如果当前数字和目标数字的差等于另一个已经存在的数字，立即返回这 2 个数字的下标

## 题解

1. 遍历数组
2. 判断 target - num[i] 是否存在 map 中
   1. 如果不存在，储存 nums[i] 和 i 到 map 中，key 为 nums[i]
   2. 如果存在，返回当前 i 和 map 中的 i
3. 遍历结束，返回空数组 []

## 示例

<<< @/docs/数据结构和算法/1-两数之和/index.ts
