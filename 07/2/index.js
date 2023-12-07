/**
--- Part Two ---
To make things a little more interesting, the Elf introduces one additional
rule. Now, J cards are jokers - wildcards that can act like whatever card would
make the hand the strongest type possible.

To balance this, J cards are now the weakest individual cards, weaker even than
2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2,
J.

J cards can pretend to be whatever card is best for the purpose of determining
hand type; for example, QJJQ2 is now considered four of a kind. However, for the
purpose of breaking ties between two hands of the same type, J is always treated
as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J
is weaker than Q.

Now, the above example goes very differently:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483

- 32T3K is still the only one pair; it doesn't contain any jokers, so its
strength doesn't increase.

- KK677 is now the only two pair, making it the second-weakest hand.

- T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA
gets rank 4, and KTJJT gets rank 5.

With the new joker rule, the total winnings in this example are 5905.

Using the new joker rule, find the rank of every hand in your set. What are the
new total winnings?
 **/

const input = await Deno.readTextFile("../input");
// const input = await Deno.readTextFile("../short-input");

const hands = input
  .trim()
  .split("\n")
  .map((hand) => {
    return { ...hand.match(/(?<cards>[A-Z2-9]{5}) (?<bid>\d+)/).groups };
  })
  .map((hand) => {
    return {
      ...hand,
      bid: Number(hand.bid),
    };
  });

const CARDS = "J23456789TJQKA";
const ALPHABET = "abcdefghijklmn";

// Translate CARDS into letters of the alphabet, which we can easily sort with
// localeCompare
function sortableCards(cards) {
  return cards
    .split("")
    .map((card) => ALPHABET.charAt(CARDS.indexOf(card)))
    .join("");
}

/* Scorer is a recursive function that scores a hand of cards. It takes the first
 * card and finds how many cards left in the hand match it. It saves the number
 * of matches in the score object and removes all the matched cards from the
 * hand. If there are more cards left, it calls itself again.
 *
 * At the end, it will have a score object like this:
 * { 3: 1 } (three of a kind)
 * { 3: 1, 2: 1 } (full house) ...&c.
 *
 * Before returning the final time, it converts that score object into a final
 * score, which is just a single number, where five-of-a-kind is 7 and no
 * matches is a 1.
 */
function scorer(cards, score = {}) {
  const card = cards[0];
  cards.shift();

  if (!cards.length) {
    return finalScore(score);
  }

  let matched = 1;
  while (cards.includes(card) || cards.includes("J")) {
    const match = cards.includes(card)
      ? cards.indexOf(card)
      : cards.indexOf("J");
    matched += 1;
    cards.splice(match, 1);
  }

  score[matched] = score[matched] ? score[matched] + 1 : 1;

  return scorer(cards, score);
}

/**
 * Turn a score object ({ 3: 1, 2: 1}) into a numeral based on what hands beat
 * what other hands.
 */
function finalScore(score) {
  // console.log("prior to final score", score);
  // Five of a kind
  if (score["5"]) {
    return 7;
  }

  // Four of a kind
  if (score["4"]) {
    return 6;
  }

  // Full house
  if (score["3"] && score["2"]) {
    return 5;
  }

  // Three of a kind
  if (score["3"]) {
    return 4;
  }

  // Two pairs
  if (score["2"] === 2) {
    return 3;
  }

  // One pair
  if (score["2"] === 1) {
    return 2;
  }

  // High card
  return 1;
}

// Sort hands by score, break ties by high card
function sortHands(a, b) {
  if (a.score !== b.score) {
    return a.score - b.score;
  } else {
    return sortableCards(a.cards).localeCompare(sortableCards(b.cards));
  }
}

function charsInString(char, str) {
  const arr = str.split("");
  let count = 0;
  while (arr.includes(char)) {
    count += 1;
    const i = str.indexOf(char);
    arr.splice(i, 1);
  }
  return count;
}

/* Sort a hand by...
  1. How many of the same card are in the hand (this lets us try to apply Jokers
     to the highest-potential match)
  2. Whether it's a joker or not (we always sort jokers to the back)
*/
function sortByNumberOfSameCards(cards) {
  return cards.split("").sort((a, b) => {
    const numCharsA = charsInString(a, cards);
    const numCharsB = charsInString(b, cards);
    if (a === "J" || b === "J") {
      // Jokers ALWAYS to the back!
      // If we try to score with the Jokers *first*, the scorer doesn't really
      // know how to treat it like a wild card.
      return a === "J" ? 1 : -1;
    } else if (numCharsA !== numCharsB) {
      // Sort by how many of the same cards are in the hand
      return numCharsB - numCharsA;
    } else {
      // Break ties by comparing card value
      return sortableCards(b).localeCompare(sortableCards(a));
    }
  });
}

const totalWinnings = hands
  .map((hand) => {
    return {
      ...hand,
      // Determine a score for each hand
      score: scorer(sortByNumberOfSameCards(hand.cards)),
    };
  })
  // Sort hands by rank
  .sort(sortHands)
  // Transform ranked hands & their bids into an amount won
  .map((hand, i) => hand.bid * (i + 1))
  // Find the total winnings
  .reduce((sum, winning) => sum + winning, 0);

console.log("totalWinnings", totalWinnings);
