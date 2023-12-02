export function possibleGame(game, bag) {
  return game.pulls.every((pull) => {
    return ["red", "green", "blue"].every((color) => pull[color] <= bag[color]);
  });
}

export function parseGame(line) {
  const id = parseInt(line.match(/^Game (?<id>\d+):/).groups?.id || 0, 10);
  const pulls = line.split(";").map((p) => {
    const pull = {};
    ["red", "green", "blue"].forEach((color) => {
      const regexp = new RegExp(`(?<num>\\d+) ${color}`);
      pull[color] = parseInt(p.match(regexp)?.groups?.num || 0, 10);
    });

    return pull;
  });
  return { id, pulls };
}

export function minimumSet(game) {
  const max = { red: 0, green: 0, blue: 0 };
  game.pulls.forEach((pull) =>
    ["red", "green", "blue"].forEach((color) => {
      if (pull[color] > max[color]) {
        max[color] = pull[color];
      }
    })
  );
  return max;
}
