/**
--- Part Two ---
Your calculation isn't quite right. It looks like some of the digits are
actually spelled out with letters: one, two, three, four, five, six, seven,
eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last
digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen

In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76.
Adding these together produces 281.

What is the sum of all of the calibration values?
 */

const input = await Deno.readTextFile("input");

const NUMBER_WORDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const REVERSED_NUMBER_WORDS = NUMBER_WORDS.map((word) =>
  word.split("").reverse().join("")
);

// Get the first digit of a string where that first digit could be either an
// actual digit or a word spelling a number from one through nine.
//
// The function accepts a dynamic array of number words so that they can be
// reversed to start from the back of a string.
function getFirstDigit(str, numberWords) {
  const firstChar = str.substring(0, 1);

  if (/\d/.test(firstChar)) {
    return firstChar;
  } else {
    // Iterate through the number words and check the beginning of the string
    // for a possible match
    for (let i = 0; i < numberWords.length; i += 1) {
      const word = numberWords[i];
      if (str.substring(0, word.length).toLowerCase() === word) {
        return i + 1;
      }
    }

    if (str.length > 1) {
      // If there's more string to check, try it again with the first character
      // (the one we just checked) lopped off
      return getFirstDigit(str.substring(1), numberWords);
    } else {
      // No luck!
      return "";
    }
  }
}

// It's essential to this problem to check for spelled digits from the front and
// then from the back. You have to be wary of strings like this:
//
// eightwothree231sevenine
//
// See the issue? Any transformation that just goes from left to right is going
// to prefer the "seven" to that "nine" on the end.
function firstAndLastDigits(str) {
  const firstDigit = getFirstDigit(str, NUMBER_WORDS);
  const lastDigit = getFirstDigit(
    str.split("").reverse().join(""),
    REVERSED_NUMBER_WORDS
  );

  return `${firstDigit}${lastDigit}`;
}

const nums = input.trim().split("\n").map(firstAndLastDigits);

// Add up all the numbers
const calibrationSum = nums.reduce((sum, num) => sum + parseInt(num, 10), 0);

console.log("calibrationSum", calibrationSum);
