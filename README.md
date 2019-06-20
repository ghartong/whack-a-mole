# whack-a-mole
Pure vanilla JS game by Glenn Hartong

## Requirements
- The game should function consistently in IE11+ and one other major browser
- The game should function consistently in at least 2 unique viewport sizes
- No frameworks or libraries allowed; HTML, CSS, JS only

## Game Objective
Click a “mole” as it appears. The amount of time each mole stays visible is random. The game has time limit. There are controls available to start, pause, and reset the game.

## Scoring and Leveling
- Each successful hit of a mole will increment the score by one point
- Every ten points the level will increment by one
- Every level increase will reset the game clock
- Every level will be five seconds shorter than the previous level

## Random Thoughts
- The nature of generating "random" numbers in JS is such that we may get a duplicate number with consecutive tries. This results in what appears to be the mole not moving. I considered adding a duplicate check to not allow this. However, I believe I can remember the mole in a physical whack-a-mole game popping up in the same hole. For this reason, I did not stop duplicates in the game.
- I used a CSS Button Generator https://www.bestcssbuttongenerator.com/#/14 to style the Pause, Start, Reset buttons. The generator offers complimentary colors and quickly makes a visually appealing button. I suppose this is lazy, but for the sake of aesthetics I made the decision. 
- Favicons generated at https://favicon.io/favicon-generator/
- I used a "tada" animation by Daniel Eden https://daneden.github.io/animate.css/ for the "Level Up!" animation to give it a little flair.
- Thanks for playing !