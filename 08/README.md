Part 1 was fun and easy.

Part 2 involves MAAAAAATTTTTTHHHHHHHHHHHHHH. I let my naïve, brute-force
first-stab at part 2 run for about 20 minutes before checking Twitter for other
people's comments, trying to get a hint without too much of a spoiler. All I saw
was math / brute force will not work.

Once I was given that hint, I came pretty quickly upon the idea of finding the
least common multiple of the final step count for each starting node on its own,
but implementing that was a beast. And the worst problem of all was that my
logic for recording the step count at which each node reached its destination
had an off-by-one error. So I kept trying different implementations of LCM
functions, even asking ChatGPT and a different website as well, and I got
different answers (which was weird) and they were all wrong because the final
step counts I was putting in were wrong.

After coming back to it later in the day, I tried my revamped lcm solution on
the short, example input (should have done that earlier!) and saw the off-by-one
error. I fixed it, switched back to the full input, and got the answer right
away.

So, as there often is, there was a procedural error that I should fix. When
trying a new solution, switch back to the small, example input and make sure it
works there instead of continuing to work with the full input, where it's harder
to personally check the accuracy of intermediary steps.
