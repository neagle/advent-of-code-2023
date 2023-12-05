/**
--- Part Two ---
Everyone will starve if you only plant such a small number of seeds. Re-reading
the almanac, it looks like the seeds: line actually describes ranges of seed
numbers.

The values on the initial seeds: line come in pairs. Within each pair, the first
value is the start of the range and the second value is the length of the range.
So, in the first line of the example above:

seeds: 79 14 55 13

This line describes two ranges of seed numbers to be planted in the garden. The
first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91,
92. The second range starts with seed number 55 and contains 13 values: 55, 56,
..., 66, 67.

Now, rather than considering four seed numbers, you need to consider a total of
27 seed numbers.

In the above example, the lowest location number can be obtained from seed
number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77,
temperature 45, humidity 46, and location 46. So, the lowest location number is
46.

Consider all of the initial seed numbers listed in the ranges on the first line
of the almanac. What is the lowest location number that corresponds to any of
the initial seed numbers?
*/

const input = await Deno.readTextFile("../input");
// const input = await Deno.readTextFile("../short-input");

function parseMap(str) {}

function parseSeeds(str) {
  const seeds = str
    .split(/(\d+ \d+)/)
    .filter((seed) => /[^\s*]/.test(seed))
    .map((seed) => {
      const [start, length] = seed.split(" ").map(Number);
      return {
        start,
        length,
      };
    });
  return seeds;
}

const seeds = parseSeeds(
  input.match(/seeds: (?<numbers>[\d\s]*)/).groups.numbers.trim()
);

console.log("seeds", seeds);

const mapMatches = input.matchAll(
  /(?<name>[a-z\-]*) map:\n(?<numbers>[\d\s\n]*)/g
);

const maps = [];
for (const match of mapMatches) {
  const { name, numbers } = match.groups;
  maps.push({
    name,
    ranges: numbers
      .trim()
      .split("\n")
      .map((str) => {
        const range = str.split(" ").map(Number);
        return {
          destination: range[0],
          source: range[1],
          length: range[2],
        };
      }),
  });
}

// console.log("maps", maps);

function applyMap(num, map) {
  for (let i = 0; i < map.ranges.length; i += 1) {
    const range = map.ranges[i];
    if (num >= range.source && num <= range.source + range.length) {
      return range.destination + (num - range.source);
    }
  }

  return num;
}

// You'll want the console logs on this one... for the full input, this one
// takes a while! 😥
const lowest = Math.min(
  ...seeds.map(({ start, length }) => {
    console.log("start, length", start, length);
    let min = maps.reduce(applyMap, start);
    for (let i = start + 1; i < start + length; i += 1) {
      const location = maps.reduce(applyMap, i);
      // console.log("location", i, location);
      if (location < min) {
        min = location;
      }
    }
    console.log("seed min:", min);
    return min;
  })
);

console.log("lowest", lowest);
