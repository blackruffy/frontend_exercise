const obj = {
    1: {
        11: 1,
        12: {
            121: 2,
            122: {
                1221: 3,
                1222: 4,
                1223: 5,
            } 
        },
        13: {
            131: 6,
            132: 7 
        },
        14: 8,
    },
    2: 9
};

function sum(obj) {
  const a = Array.from(Object.entries(obj));
  if (a.length === 0) return 0;
  else {
    const [[k, v], ...xs] = a;
    return (typeof v === 'number' ? v : sum(v)) + sum(Object.fromEntries(xs));
  }
}

console.log(sum(obj));
