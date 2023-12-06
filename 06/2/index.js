/**
As the race is about to start, you realize the piece of paper with race times
and record distances you got earlier actually just has very bad kerning. There's
really only one race - ignore the spaces between the numbers on each line.

So, the example from before:

Time:      7  15   30
Distance:  9  40  200

...now instead means this:

Time:      71530
Distance:  940200

Now, you have to figure out how many ways there are to win this single race. In
this example, the race lasts for 71530 milliseconds and the record distance you
need to beat is 940200 millimeters. You could hold the button anywhere from 14
to 71516 milliseconds and beat the record, a total of 71503 ways!

How many ways can you beat the record in this one much longer race?
*/

const input = await Deno.readTextFile("../input");

const [time, record] = Object.values(
  input.match(/Time:\s+(?<time>[\d\s]+)\nDistance:\s+(?<distance>[\d\s]+)/)
    .groups
).map((value) =>
  Number(
    value
      .split("")
      .filter((value) => !/\s+/.test(value))
      .join("")
  )
);
console.log("time, record", time, record);

// See the JS file for part 1 for a fuller explanation of this solution.
function quadratic(time, record) {
  const a = 1;
  const b = time * -1;
  const c = record;

  const sqrt = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
  return [(b * -1 - sqrt) / (2 * a), (b * -1 + sqrt) / (2 * a)];
}

function winningTimes([time, record]) {
  const [min, max] = quadratic(time, record).map(Math.floor);
  // The number of winning times is the highest possible time to produce the
  // record - the smallest possible time to produce the record. Any time in
  // between will beat it.
  return max - min;
}

const winners = winningTimes([time, record]);

console.log("winners", winners);
