Today's was a pretty smooth solve. I love using named groups, and parsing the
card values first into 'winners' and 'numbers' strings, then just splitting them
apart by spaces was very easy, as RegEx parsing goes.

Once there, getting card values as in part one is a simple function to use with
reduce.

The second part, which required multiplying cards, looked potentially more
complicated, but adding a 'copies' key to each parsedCard made it pretty
straightforward. Just iterate through the list of cards and use the copies value
to determine how much to increase subsequent card.copies values by. No need for
multidimensional arrays.
