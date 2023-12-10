/**
--- Part Two ---
Of course, it would be nice to have even more history included in your report.
Surely it's safe to just extrapolate backwards as well, right?

For each history, repeat the process of finding differences until the sequence
of differences is entirely zero. Then, rather than adding a zero to the end and
filling in the next values of each previous sequence, you should instead add a
zero to the beginning of your sequence of zeroes, then fill in new first values
for each previous sequence.

In particular, here is what the third example history looks like when
extrapolating back in time:

5  10  13  16  21  30  45
  5   3   3   5   9  15
   -2   0   2   4   6
      2   2   2   2
        0   0   0

Adding the new values on the left side of each sequence from bottom to top
eventually reveals the new left-most history value: 5.

Doing this for the remaining example data above results in previous values of -3
for the first history and 0 for the second history. Adding all three new values
together produces 2.

Analyze your OASIS report again, this time extrapolating the previous value for
each history. What is the sum of these extrapolated values?
**/

const input = await Deno.readTextFile("../input");
// const input = `0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45`;

const histories = input
  .split("\n")
  .map((history) => history.split(" ").map(Number));
// console.log("histories", histories);

// A recursive function that will keep calculating history layers (rows of the
// differences between the previous row) until it reaches all zeroes.
function analyzeHistory(history) {
  if (!Array.isArray(history[0])) {
    history = [history];
  }

  const lastHistory = history.at(-1);
  const newHistory = [];

  for (let i = lastHistory.length - 1; i > 0; i -= 1) {
    newHistory.unshift(lastHistory[i] - lastHistory[i - 1]);
  }

  history.push(newHistory);

  if (newHistory.every((value) => value === 0)) {
    return history;
  } else {
    return analyzeHistory(history);
  }
}

function extrapolatePreviousValue(analysis) {
  let value = analysis.at(-1).at(0);

  for (let i = analysis.length - 2; i >= 0; i -= 1) {
    value = analysis[i].at(0) - value;
  }

  return value;
}

const analyzedHistories = histories.map(analyzeHistory);

// console.log("analyzedHistories", analyzedHistories);

const extrapolatedValues = analyzedHistories.map(extrapolatePreviousValue);
// console.log("extrapolatedValues", extrapolatedValues);

const sumOfExtrapolatedValues = extrapolatedValues.reduce(
  (sum, value) => sum + value,
  0
);
console.log("sumOfExtrapolatedValues", sumOfExtrapolatedValues);
