/**
--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine
springs to life, you jump in the closest gondola, finally ready to ascend to the
water source.

You don't seem to be going very fast, though. Maybe something is still wrong?
Fortunately, the gondola has a phone labeled "help", so you pick it up and the
engineer answers.

Before you can explain the situation, she suggests that you look out the window.
There stands the engineer, holding a phone in one hand and waving with the
other. You're going so slowly that you haven't even left the station. You exit
the gondola.

The missing part wasn't the only issue - one of the gears in the engine is
wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its
gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so
that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has
part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the
lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear
because it is only adjacent to one part number.) Adding up all of the gear
ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
**/

const input = await Deno.readTextFile("../input");
const lines = input.split("\n");

// Keep an array of gears -- this will be a mirror of the input, but it will be
// a sparse array thats only populated with numbers at the x, y (lineIndex,
// charIndex) of * symbols.
//
// Wherever a * symbol is found, we'll put an array there and add numbers that
// touch it. When we've iterated through all the input, we can go through this
// gear list and find any array that has two numbers in it and multiply them
// together, discarding others. (Those were gear symbols that didn't touch two
// numbers.)
//
// Note that this approach relies on gear symbols never touching MORE than two
// numbers, but that assumption seems to be valid with the input given by the
// problem.
const gears = [];

// Check an individual char to see if it's a gear
function findGear({ char, lineIndex, charIndex, num, gears }) {
  if (char === "*") {
    if (!gears[lineIndex]) {
      gears[lineIndex] = [];
    }

    if (Array.isArray(gears[lineIndex][charIndex])) {
      // Push a second number to this gear's array
      gears[lineIndex][charIndex].push(num);
    } else {
      // Add an array with a first number to this gear
      gears[lineIndex][charIndex] = [num];
    }
  }
}

// Try to find gear symbols for this number
function findGears({ matched, start, end }, index, gears) {
  const line = lines[index];

  // Check the preceding and following chars in the same line
  [start - 1, end].forEach((i) => {
    findGear({
      char: line.charAt(i),
      lineIndex: index,
      charIndex: i,
      num: matched,
      gears,
    });
  });

  // Check the previous and next lines
  [index - 1, index + 1].forEach((lineIndex) => {
    if (lines[lineIndex]) {
      // Check each char starting and ending with diagonals
      for (let i = start - 1; i <= end; i += 1) {
        findGear({
          char: lines[lineIndex].charAt(i),
          lineIndex,
          charIndex: i,
          num: matched,
          gears,
        });
      }
    }
  });
}

lines.forEach((line, i) => {
  // Find all the numbers
  const matches = line.matchAll(/\d+/g);

  for (const match of matches) {
    const matched = parseInt(match[0], 10);
    const start = match.index;
    const end = match.index + match[0].length;

    findGears({ matched, start, end }, i, gears);
  }
});

const gearRatios = gears
  .flat()
  // Multiply all gears with two numbers together.
  // If there's just one number, set the product to 0.
  .map((gear) => (gear.length === 2 ? gear[0] * gear[1] : 0));

console.log("gearRatios", gearRatios);

const gearRatiosSum = gearRatios.reduce((sum, ratio) => sum + ratio, 0);
console.log("sum", gearRatiosSum);
