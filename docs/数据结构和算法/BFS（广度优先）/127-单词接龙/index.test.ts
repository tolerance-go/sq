import ladderLength from './code';

test(`ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog'])`, () => {
  expect(
    ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']),
  ).toStrictEqual(5);
});
