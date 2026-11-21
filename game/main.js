// Twin Garden — entry point. Boots the game and honours the screenshot
// shortcuts the maker uses to stage a shot: ?shot=start|play|end,
// ?level=1..3 and ?found=<comma-separated difference ids>.
// Examples: ?shot=play&level=2&found=beam,sail  ?shot=end

import { Game } from './game.js';
import { SCENES } from './scenes.js';

const game = new Game();

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  const level = Math.min(SCENES.length, Math.max(1, Number(params.get('level') || 1))) - 1;
  if (shot === 'play') {
    game.startLevel(level);
    const wanted = (params.get('found') || '').split(',').filter(Boolean);
    for (const id of wanted) {
      const diff = game.scene.differences.find((d) => d.id === id);
      if (diff) {
        game.found.add(diff.id);
        game.score += 100;
      }
    }
    game.updateHud();
  } else if (shot === 'end') {
    game.score = 2350;
    game.showWin();
  }
  // shot=start leaves the title screen as it is.
}
