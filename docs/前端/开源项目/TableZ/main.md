# TableZ

## 需求

1. 用户输入编辑
2. cell 依赖计算，可能有循环依赖，不过一次更新触发的依赖具有方向性
3. 用户可以回撤

## 实现

1. 性能问题

   1. 减少 diff 节点，只在更新行列数量的时候，对表格整体更新
   2. 当用户输入的时候，只对 cell 进行 diff
      1. 联动的 cell 数量不会很多

2. 依赖计算

   1. 事件分发机制，递归调用
      1. 根据 结构类型和字段类型 作为 key，注册依赖回调
      2. 传递 paths 引用，根据节点是否存在 paths 上解决循环依赖对问题
   2. 异步计算
      1. 如果一个节点的计算规则是异步得到的结果，这个计算称作异步计算
      2. 对每个 cell 增加 pending 状态，先执行异步计算，派发 change 事件，值为 promise 对象，后续节点设置该值为 empty，key 为 paths 的引用
         1. 当 promise 状态变更，继续发送 change 事件，携带值，后续节点根据 paths 更新 values 上的 empty 值

3. 用户回撤

   1. 用户点击回撤，或者在某一个 cell 上执行回撤快捷键，相关的数据都要回溯到上一个状态，这样对于 cell 历史值需要存储起来，在回撤的时候不用重复计算
      1. 我们使用 map 来存放，最后一个插入的数据，永远作为显示数据
      2. 使用 paths 作为 key 来存储值
   2. 当用户回撤都时候，map 上的对应 key 给删除
