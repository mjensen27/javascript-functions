function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x == j && y == k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return JSON.stringify(this).includes(JSON.stringify(cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? "\u25A3" : "\u25A2";
};

const corners = (state = []) => {
  return {
    topRight: state.length
      ? state.reduce((a, b) => {
          return [a[0] > b[0] ? a[0] : b[0], a[1] > b[1] ? a[1] : b[1]];
        }, [])
      : [0, 0],
    bottomLeft: state.length
      ? state.reduce((a, b) => {
          return [a[0] < b[0] ? a[0] : b[0], a[1] < b[1] ? a[1] : b[1]];
        }, [])
      : [0, 0],
  };
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    accumulator += row.join(" ") + "\n";
  }
  return accumulator;
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x + 1, y - 1],
    [x, y + 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((x) => contains.bind(state)(x));
};

const willBeAlive = (cell, state) => {
  return (
    getLivingNeighbors(cell, state).length == 3 ||
    (contains.call(state, cell) && getLivingNeighbors(cell, state).length == 2)
  );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let accumulator = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      accumulator = accumulator.concat(
        willBeAlive([x, y], state) ? [[x, y]] : []
      );
    }
  }
  return accumulator;
};

const iterate = (state, iterations) => {};

const main = (pattern, iterations) => {};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
