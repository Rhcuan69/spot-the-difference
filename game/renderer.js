// Twin Garden — renderer. Paints one scene panel and the marks on it:
// green rings where a difference was found, a pulsing hint ring, the
// keyboard crosshair, and a brief red flash on a wrong click.

import { PANEL_W, PANEL_H } from './scenes.js';

const FOUND_RING = '#2c8a3e';
const HINT_RING = '#d9a441';

export function renderPanel(canvas, scene, variant, marks) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  scene.draw(ctx, variant);

  // Rings around the differences already found.
  for (const d of scene.differences) {
    if (!marks.found.has(d.id)) continue;
    ctx.strokeStyle = FOUND_RING;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 9, 0, Math.PI * 2);
    ctx.stroke();
    // Little check mark at the ring's top-right.
    ctx.strokeStyle = FOUND_RING;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x + d.r - 2, d.y - d.r + 8);
    ctx.lineTo(d.x + d.r + 6, d.y - d.r + 16);
    ctx.lineTo(d.x + d.r + 18, d.y - d.r - 2);
    ctx.stroke();
  }

  // Hint: a pulsing gold ring around one difference not yet found.
  if (marks.hint && !marks.found.has(marks.hint.id)) {
    const pulse = 3 + Math.sin(marks.hintPulse * 6) * 2;
    ctx.strokeStyle = HINT_RING;
    ctx.lineWidth = 4 + pulse;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(marks.hint.x, marks.hint.y, marks.hint.r + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Wrong-click flash: a red X that fades.
  if (marks.wrong && marks.wrongAge < 1) {
    const a = 1 - marks.wrongAge;
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const { x, y } = marks.wrong;
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 14);
    ctx.lineTo(x + 14, y + 14);
    ctx.moveTo(x + 14, y - 14);
    ctx.lineTo(x - 14, y + 14);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Keyboard crosshair, drawn at the same scene spot on both panels.
  if (marks.cursor && marks.cursor.visible) {
    const { x, y } = marks.cursor;
    ctx.strokeStyle = '#2e2a22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#d9a441';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#2e2a22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 22, y);
    ctx.lineTo(x - 12, y);
    ctx.moveTo(x + 12, y);
    ctx.lineTo(x + 22, y);
    ctx.moveTo(x, y - 22);
    ctx.lineTo(x, y - 12);
    ctx.moveTo(x, y + 12);
    ctx.lineTo(x, y + 22);
    ctx.stroke();
  }
}

// Draw both panels for a level: left is the original, right carries every change.
export function renderBoth(leftCanvas, rightCanvas, scene, marks) {
  renderPanel(leftCanvas, scene, new Set(), marks);
  renderPanel(rightCanvas, scene, new Set(scene.differences.map((d) => d.id)), marks);
}
