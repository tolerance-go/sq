const height = 500;
document.getElementById('root').style.height = height + 'px';
// eslint-disable-next-line no-undef
d3.select('#root').graphviz({ height }).renderDot(`digraph {

    edge[decorate=true];

    a [label="hit"];
    b1 [label="*it", shape=box];
    b2 [label="h*t", shape=box];
    b3 [label="hi*", shape=box];
    c1 [label="hot", color=red];
    d1 [label="*ot", shape=box];
    d2 [label="h*t", shape=box];
    d3 [label="ho*", shape=box];
    e1 [label="hot", color=red];
    e2 [label="dot"];
    e3 [label="lot"];
    e4 [label="hot", color=red];
    e5 [label="hot", color=red];

    a -> {b1,b2,b3};
    b2 -> c1[label="level + 1"];
    c1 -> d1;
    c1 -> {d2,d3}[style=dotted];
    d1 -> e1;
    d1 -> {e2,e3}[label="level + 1"];
    d2 -> e4[style=dotted];
    d3 -> e5[style=dotted];

}`);

// { '*ot': [ 'hot', 'dot', 'lot' ],
//   'h*t': [ 'hot' ],
//   'ho*': [ 'hot' ],
//   'd*t': [ 'dot' ],
//   'do*': [ 'dot', 'dog' ],
//   '*og': [ 'dog', 'log', 'cog' ],
//   'd*g': [ 'dog' ],
//   'l*t': [ 'lot' ],
//   'lo*': [ 'lot', 'log' ],
//   'l*g': [ 'log' ],
//   'c*g': [ 'cog' ],
//   'co*': [ 'cog' ] }
