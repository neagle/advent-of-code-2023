/**
--- Part Two ---
The galaxies are much older (and thus much farther apart) than the researcher
initially estimated.

Now, instead of the expansion you did before, make each empty row or column one
million times larger. That is, each empty row should be replaced with 1000000
empty rows, and each empty column should be replaced with 1000000 empty columns.

(In the example above, if each empty row or column were merely 10 times larger,
the sum of the shortest paths between every pair of galaxies would be 1030. If
each empty row or column were merely 100 times larger, the sum of the shortest
paths between every pair of galaxies would be 8410. However, your universe will
need to expand far beyond these values.)

Starting with the same initial image, expand the universe according to these new
rules, then find the length of the shortest path between every pair of galaxies.
What is the sum of these lengths?
**/
const input = await Deno.readTextFile("../input");
// const input = `...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....`;

const universe = input.split("\n").map((row) => row.split(""));
// console.log("universe", universe);

const SPACE = ".";
const GALAXY = "#";

// const testArr = [
//   [1, 1, 1, 1, 1],
//   [2, 2, 2, 2, 2],
//   [3, 3, 3, 3, 3],
// ];
function flipArray(arr) {
  const rotated = [];
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      if (!rotated[j]) {
        rotated.push([]);
      }
      rotated[j].push(arr[i][j]);
    }
  }

  return rotated;
}

const expandedRows = [];
const expandedCols = [];

function expandUniverse(universe, flipped = false) {
  // console.log(flipped ? "now flip cols" : "flip rows");
  const expanded = [];
  // Rows
  for (let i = 0; i < universe.length; i += 1) {
    const row = universe[i];
    expanded.push(structuredClone(row));
    if (universe[i].every((coordinate) => coordinate === SPACE)) {
      // console.log("DOUBLE this row, cause it's all space", i, row);
      if (!flipped) {
        expandedRows.push(i);
      } else {
        expandedCols.push(i);
      }
      expanded.push(structuredClone(row));
    }
  }

  return flipped
    ? flipArray(expanded)
    : expandUniverse(flipArray(expanded), true);
}

function ascii(universe) {
  return universe.map((row) => row.join("")).join("\n");
}

const expandedUniverse = expandUniverse(universe);

console.log("expandedRows, expandedCols", expandedRows, expandedCols);

// console.log(ascii(expandedUniverse));

const expandedReference = `....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......`;

/*
console.log(
  "ascii(expandedUniverse) === expandedReference",
  ascii(expandedUniverse) === expandedReference
);

console.log(
  "expandedUniverse.length, expandedUniverse[0].length",
  expandedUniverse.length,
  expandedUniverse[0].length
);

*/

const galaxies = universe.reduce((acc, row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === GALAXY) {
      acc.push([i, j]);
    }
  });

  return acc;
}, []);

console.log("galaxies", galaxies);

function translateCoordinates(coordinates) {
  // console.log("coordinates", coordinates);
  const MULTIPLIER = 1000000;
  const translated = [...coordinates];
  [expandedRows, expandedCols].forEach((expanded, i) => {
    // console.log("expanded", expanded);
    const expansion = expanded.reduce(
      (acc, item) => (item < translated[i] ? acc + 1 : acc),
      0
    );
    // console.log("expansion", expansion);

    translated[i] += expansion * -1 + expansion * MULTIPLIER;
  });

  return translated;
}

const translatedGalaxies = galaxies.map(translateCoordinates);
console.log("translatedGalaxies", translatedGalaxies);

function getDistances(inputGalaxies) {
  const galaxies = structuredClone(inputGalaxies);
  const distances = [];
  while (galaxies.length) {
    const galaxy1 = galaxies[0];
    for (let i = 1; i < galaxies.length; i += 1) {
      const galaxy2 = galaxies[i];
      const distance =
        Math.abs(galaxy2[0] - galaxy1[0]) + Math.abs(galaxy2[1] - galaxy1[1]);
      distances.push(distance);
    }
    galaxies.shift();
  }

  return distances;
}

const distances = getDistances(translatedGalaxies);

const distanceSum = distances.reduce((sum, distance) => sum + distance, 0);
console.log("distanceSum", distanceSum);
