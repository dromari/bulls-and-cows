# Bulls and Cows

A functional-programming implementation of the classic [Bulls and Cows](https://en.wikipedia.org/wiki/Bulls_and_Cows) game for Rolling Scopes School.

## Deploy

- **Live demo:** https://dromari.github.io/bulls-and-cows/

## Task

- **RS School task:** https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/bulls-and-cows/README.md

## Description

The computer generates a secret number of a chosen length (2–6 digits) in a chosen numeral system (binary, octal, decimal, or hexadecimal). The player enters guesses and receives feedback after each attempt:

- **Bulls** — digits guessed correctly and in the correct position.
- **Cows** — digits guessed correctly but in the wrong position.

The game continues until the secret is guessed. The number of attempts and elapsed time are saved to the leaderboard stored in `localStorage`.

## Tech stack

- TypeScript 5.7
- Vitest
- ESLint 9 + Prettier 3
- Husky + lint-staged
- GitHub Pages

## Scripts

```bash
npm test      # run tests
npm run lint  # run ESLint
npm run format # format code with Prettier
npm run build # compile TypeScript to dist/
npm run dev   # run Vitest in watch mode
```

## Architecture

- `src/core/` — pure game logic (no DOM, no classes).
- `src/ui/` — DOM rendering via `document.createElement`.
- `src/storage/` — localStorage helpers for the leaderboard.
- `DESIGN.md` — architecture, algorithms, Big-O analysis, and clean-code principles.
