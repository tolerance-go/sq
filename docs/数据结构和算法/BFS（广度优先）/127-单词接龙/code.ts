/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
const ladderLength = (beginWord, endWord, wordList) => {
  if (!endWord || wordList.indexOf(endWord) == -1) {
    return 0;
  }
  // 各个通用状态对应所有单词
  const comboDicts = {};
  const len = beginWord.length;
  for (let i = 0; i < wordList.length; i++) {
    for (let r = 0; r < len; r++) {
      const newWord =
        wordList[i].substring(0, r) + '*' + wordList[i].substring(r + 1, len);
      !comboDicts[newWord] && (comboDicts[newWord] = []);
      comboDicts[newWord].push(wordList[i]);
    }
  }

  const visitWord = (currQueue, currVisited, othersVisited) => {
    const currNode = currQueue.shift();
    const currWord = currNode[0];
    const currLevel = currNode[1];
    for (let i = 0; i < len; i++) {
      // 通用状态
      const newWord =
        currWord.substring(0, i) + '*' + currWord.substring(i + 1, len);
      if (newWord in comboDicts) {
        const tmpWords = comboDicts[newWord];
        for (let z = 0; z < tmpWords.length; z++) {
          if (othersVisited[tmpWords[z]] != undefined) {
            return currLevel + othersVisited[tmpWords[z]];
          }
          if (currVisited[tmpWords[z]] == undefined) {
            currVisited[tmpWords[z]] = currLevel + 1;
            currQueue.push([tmpWords[z], currLevel + 1]);
          }
        }
      }
    }
    return -1;
  };

  // Queue for BFS from beginWord
  const queueBegin = [[beginWord, 1]];
  // Queue for BFS from endWord
  const queueEnd = [[endWord, 1]];
  // visited begin and end
  const visitedBegin = {};
  visitedBegin[beginWord] = 1;
  const visitedEnd = {};
  visitedEnd[endWord] = 1;
  while (queueBegin.length > 0 && queueEnd.length > 0) {
    // fromBegin
    let ans = visitWord(queueBegin, visitedBegin, visitedEnd);
    if (ans > -1) {
      return ans;
    }
    // formEnd
    ans = visitWord(queueEnd, visitedEnd, visitedBegin);
    if (ans > -1) {
      return ans;
    }
  }
  return 0;
};

export default ladderLength;
