# Twin Garden — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Rhcuan69/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Rhcuan69/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game for the make.fun bounty
[best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
("Make the best spot the difference game"). Two near-identical pictures side
by side, 7 differences to find in each of 3 hand-drawn scenes. All art is
drawn procedurally in code — no image, audio, or font files, no libraries, no
network requests. It runs offline in a desktop browser from static files.

## How to play

- **Click** a difference to mark it with a green ring, or move the crosshair
  with the **arrow keys** and press **Enter**.
- The HUD shows how many differences are found, how many remain, the timer,
  the score, and hints left. Press **H** for a hint (3 per level): a pulsing
  gold ring points at an unfound difference.
- A wrong click costs 25 points and shows a red X. Find all 7 to clear the
  level; clear all 3 scenes to win. Difficulty ramps: 180s, 150s, 120s.
- Sounds are synthesized with WebAudio (chime, buzz, hint, fanfare, tick).
  The game pauses automatically when the tab is hidden.

## Scenes

1. **Morning Garden** — cottage, apple tree, fence cat, flower bed, butterfly.
2. **Harbour at Dusk** — lighthouse beam, red sail, gull, buoy, crate, flag.
3. **Forest Camp** — star, owl, lantern, tent door, blue flame, mushroom.

## Layout

- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to
  `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json`.
- `game/` — the playable game: `index.html`, `styles.css`, `scenes.js`
  (the 3 procedural scenes + difference tables), `renderer.js`, `game.js`
  (state machine, input, timer, score, hints), `audio.js`, `main.js`.
- `screenshots/` — 4 real renders of the game in Chromium (cover: garden
  with 3 differences found; harbour; forest; win screen).
- `vendor/makefun-game.ts` — the kit's dossier builder, copied unchanged.
- `LICENSE` — MIT (`SPDX-License-Identifier: MIT`).
- `.makefun/owner.json` — the claim file naming the account's primary wallet.

## License

MIT — see [LICENSE](LICENSE).
