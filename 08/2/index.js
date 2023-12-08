/**
--- Part Two ---
The sandstorm is upon you and you aren't any closer to escaping the wasteland.
You had the camel follow the instructions, but you've barely left your starting
position. It's going to take significantly more steps to escape!

What if the map isn't for people - what if the map is for ghosts? Are ghosts
even bound by the laws of spacetime? Only one way to find out.

After examining the maps a bit longer, your attention is drawn to a curious
fact: the number of nodes with names ending in A is equal to the number ending
in Z! If you were a ghost, you'd probably just start at every node that ends
with A and follow all of the paths at the same time until they all
simultaneously end up at nodes that end with Z.

For example:

LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)

Here, there are two starting nodes, 11A and 22A (because they both end with A).
As you follow each left/right instruction, use that instruction to
simultaneously navigate away from both nodes you're currently on. Repeat this
process until all of the nodes you're currently on end with Z. (If only some of
the nodes you're on end with Z, they act like any other node and you continue as
normal.) In this example, you would proceed as follows:

Step 0: You are at 11A and 22A.
Step 1: You choose all of the left paths, leading you to 11B and 22B.
Step 2: You choose all of the right paths, leading you to 11Z and 22C.
Step 3: You choose all of the left paths, leading you to 11B and 22Z.
Step 4: You choose all of the right paths, leading you to 11Z and 22B.
Step 5: You choose all of the left paths, leading you to 11B and 22C.
Step 6: You choose all of the right paths, leading you to 11Z and 22Z.
So, in this example, you end up entirely on nodes that end in Z after 6 steps.

Simultaneously start on every node that ends with A. How many steps does it take
before you're only on nodes that end with Z?
*/

const input = await Deno.readTextFile("../input");

const turns = input
  .match(/^[LR]*/)[0]
  .split("")
  .map((i) => (i === "L" ? 0 : 1));

console.log("turns", turns);

// Parse the input into an object of keys and L/R arrays
// Ex: { BLM: [ "QMQ", "LND" ], NJM: [ "QDK", "LSL" ], FML: [ "BRB", "CSR" ] }
const network = Array.from(
  input.matchAll(
    /(?<key>[A-Z0-9]{3}) = \((?<L>[A-Z0-9]{3}), (?<R>[A-Z0-9]{3})\)/g
  )
).reduce((acc, node) => {
  const { key, L, R } = node.groups;
  acc[key] = [L, R];
  return acc;
}, {});

// console.log("network", network);

let steps = 0;
let currentNodes = Object.keys(network).filter((key) => key.charAt(2) === "A");
console.log("currentNodes", currentNodes);

// Iterate through all of the nodes ending with A, and record the step number
// where each node reached one that ended in Z.
// That's our pattern: you can reach Z every N steps for a given starting node.
// THEREFORE -- we can reach Z for each node at the same time at the LCM (least
// common multiple) of every number.
while (currentNodes.some((node) => typeof node !== "number")) {
  const index = steps % turns.length;
  steps += 1;
  currentNodes.forEach((node, i) => {
    if (typeof node !== "number") {
      const newNode = network[node][turns[index]];
      currentNodes[i] = newNode.charAt(2) === "Z" ? steps : newNode;
    }
  });
}

console.log("currentNodes", currentNodes);

// I straight-up had ChatGPT write these three functions for me, because I have
// no idea whatsoever how to calculate the LCM of anything.
function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmArray(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lcm(result, arr[i]);
  }
  return result;
}

console.log(
  "steps",
  // Avoid JavaScript's switch to scientific notation
  lcmArray(currentNodes).toLocaleString("fullwide", { useGrouping: false })
);
