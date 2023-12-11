I'm going to just toss everything, as-is, in this initial commit. Today was a
mess, definitely the biggest challenge so far.

In part 2, the really tricky thing was figuring out how on earth to process the
rules about being able to squeeze in between pipes. I decided to create:

a) a copy of the map with just the actual loop marked out, and
b) a *doubled* copy of the loop, with an extra space for every actual space,
   with *the pipes connected*.

With the doubled copy, all the squeeze-between space becomes literal space, and
you can then figure out some more normal way of processing inside/outside.

That said, I still had trouble running into maximum call stack errors with my
recursive solution for doing that.

I kinda figured/hacked my way around that, but I did not come up with a truly
clean solution.

