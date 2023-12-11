/**
--- Day 11: Cosmic Expansion ---
You continue following signs for "Hot Springs" and eventually come across an
observatory. The Elf within turns out to be a researcher studying cosmic
expansion using the giant telescope here.

He doesn't know anything about the missing machine parts; he's only visiting for
this research project. However, he confirms that the hot springs are the
next-closest area likely to have people; he'll even take you straight there once
he's done with today's observation analysis.

Maybe you can help him with the analysis to speed things up?

The researcher has collected a bunch of data and compiled the data into a single
giant image (your puzzle input). The image includes empty space (.) and galaxies
(#). For example:

...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....

The researcher is trying to figure out the sum of the lengths of the shortest
path between every pair of galaxies. However, there's a catch: the universe
expanded in the time it took the light from those galaxies to reach the
observatory.

Due to something involving gravitational effects, only some space expands. In
fact, the result is that any rows or columns that contain no galaxies should all
actually be twice as big.

In the above example, three columns and two rows contain no galaxies:

   v  v  v
 ...#......
 .......#..
 #.........
>..........<
 ......#...
 .#........
 .........#
>..........<
 .......#..
 #...#.....
   ^  ^  ^

These rows and columns need to be twice as big; the result of cosmic expansion
therefore looks like this:

....#........
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
#....#.......

Equipped with this expanded universe, the shortest path between every pair of
galaxies can be found. It can help to assign every galaxy a unique number:

....1........
.........2...
3............
.............
.............
........4....
.5...........
............6
.............
.............
.........7...
8....9.......
In these 9 galaxies, there are 36 pairs. Only count each pair once; order within the pair doesn't matter. For each pair, find any shortest path between the two galaxies using only steps that move up, down, left, or right exactly one . or # at a time. (The shortest path between two galaxies is allowed to pass through another galaxy.)

For example, here is one of the shortest paths between galaxies 5 and 9:

....1........
.........2...
3............
.............
.............
........4....
.5...........
.##.........6
..##.........
...##........
....##...7...
8....9.......

This path has length 9 because it takes a minimum of nine steps to get from
galaxy 5 to galaxy 9 (the eight locations marked # plus the step onto galaxy 9
itself). Here are some other example shortest path lengths:

- Between galaxy 1 and galaxy 7: 15
- Between galaxy 3 and galaxy 6: 17
- Between galaxy 8 and galaxy 9: 5

In this example, after expanding the universe, the sum of the shortest path
between all 36 pairs of galaxies is 374.

Expand the universe, then find the length of the shortest path between every
pair of galaxies. What is the sum of these lengths? 
 */

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

function expandUniverse(universe, flipped = false) {
  // console.log(flipped ? "now flip cols" : "flip rows");
  const expanded = [];
  // Rows
  for (let i = 0; i < universe.length; i += 1) {
    const row = universe[i];
    expanded.push(structuredClone(row));
    if (universe[i].every((coordinate) => coordinate === SPACE)) {
      // console.log("DOUBLE this row, cause it's all space", i, row);
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

const galaxies = expandedUniverse.reduce((acc, row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === GALAXY) {
      acc.push([i, j]);
    }
  });

  return acc;
}, []);

// console.log("galaxies", galaxies);

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

const distanceSum = distances.reduce((sum, distance) => sum + distance, 0);
console.log("distanceSum", distanceSum);

/*
[6, 2] / [11, 5]
distance is 9

8 - 16
11 - 6 (5)
5 - 2 (3)
*/
