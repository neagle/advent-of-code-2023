"You know, sometimes this feels an awful lot like work..."

The solution for part one is mostly about using JavaScript's match function
effectively. I always have to look this one up on MDN, because I don't really
use iterators that much. But once I saw the example with how to find the match,
the start index, and the end index, I had everything I needed. Having those two
numbers with the match makes it easier to know the shape you have to check
around when finding all the characters that touch it.

One small issue is that all my loops in the function to check for symbols made
it seem difficult (maybe I'm overlooking something) to exit early as soon as a
symbol was found, so my solution is inefficient in that it finds all the
surrounding characters before checking for symbols, even if the first one is a
symbol.

Not too many wrong turns on this one, but part two was a bit of a bear, and the
approach that got me across the finish line is not incredibly elegant. It felt
overwhelming at first to try to figure out how to take the step from finding a
gear connected to a number and then finding a number connected to IT while
keeping track of index (it could be connected to any part of a long number, for
instance) and preventing re-finding of the original number it was connected to.

I hit on the solution by realizing I could just create a second data structure
-- a sparse array that had the same line and character indexes as the input
array, but where I'd only put info for gears. Then I could just check that gear
array at the end to see which gears got hit twice, and then use those as the
gearRatios.
