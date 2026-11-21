// Twin Garden — game logic. One Game owns the state machine (title, playing,
// scene complete, won, time up), the score, the clock, hints, mouse and
// keyboard input, and the HUD. It renders through renderer.js and plays
// sounds through audio.js. Nothing here touches the network.

import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { renderBoth } from './renderer.js';
import { SoundFX } from './audio.js';

const POINTS_PER_FIND = 100;
const WRONG_PENALTY = 25;
const HINTS_PER_LEVEL = 3;
const HINT_SHOW_MS = 2600;
const CURSOR_STEP = 14;
const BEST_KEY = 'twin-garden-best';

const $ = (id) => document.getElementById(id);

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export class Game {
  constructor() {
    this.left = $('canvas-left');
    this.right = $('canvas-right');
    this.sound = new SoundFX();
    this.screen = 'title';
    this.level = 0;
    this.score = 0;
    this.found = new Set();
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hint = null;
    this.hintUntil = 0;
    this.timeLeft = 0;
    this.lastTick = 0;
    this.wrong = null;
    this.wrongAt = 0;
    this.cursor = { x: PANEL_W / 2, y: PANEL_H / 2, visible: false };
    this.best = Number(localStorage.getItem(BEST_KEY) || 0);
    this.raf = 0;
    this.toastTimer = 0;
    this.paused = false;
    this.bindInput();
    this.buildLevelPicker();
    this.showTitle();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
    // The clock must not drain while the tab is hidden: requestAnimationFrame
    // stops there, so a returning frame would otherwise eat the whole gap.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.screen === 'playing') {
        this.paused = true;
        this.toast('Paused — take your time!');
      } else if (!document.hidden && this.paused) {
        this.paused = false;
        this.lastTick = performance.now();
        this.toast('Welcome back — keep hunting!');
      }
    });
  }

  get scene() {
    return SCENES[this.level];
  }

  // -- overlays -------------------------------------------------------------
  hideOverlays() {
    for (const id of ['overlay-title', 'overlay-level', 'overlay-win', 'overlay-time']) {
      $(id).classList.add('hidden');
    }
  }

  showTitle() {
    this.screen = 'title';
    this.hideOverlays();
    $('overlay-title').classList.remove('hidden');
    $('best-line').textContent = `Best score: ${this.best}`;
    this.level = 0;
    this.found = new Set();
    this.hint = null;
    this.timeLeft = this.scene.timeLimit;
    this.updateHud();
  }

  showLevelComplete() {
    this.screen = 'levelDone';
    const bonus = Math.ceil(this.timeLeft) * 2;
    this.score += bonus;
    $('level-done-title').textContent = `${this.scene.name} complete!`;
    $('level-done-text').textContent =
      `You found all 7 differences with ${fmtTime(this.timeLeft)} to spare — time bonus +${bonus}. ` +
      `Score: ${this.score}.`;
    $('btn-next').textContent =
      this.level + 1 < SCENES.length ? 'Next scene' : 'See your result';
    this.hideOverlays();
    $('overlay-level').classList.remove('hidden');
    this.sound.levelComplete();
    this.updateHud();
  }

  showWin() {
    this.screen = 'won';
    const rank =
      this.score >= 2400 ? 'Eagle Eye — nothing escapes you!'
      : this.score >= 1900 ? 'Sharp Shooter — a very keen eye.'
      : this.score >= 1400 ? 'Keen Observer — well hunted.'
      : 'Patient Hunter — every secret found in the end.';
    $('win-text').textContent =
      `All three scenes, all 21 differences. Final score: ${this.score}.`;
    $('win-rank').textContent = rank;
    this.hideOverlays();
    $('overlay-win').classList.remove('hidden');
    this.sound.win();
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem(BEST_KEY, String(this.best));
      $('best-line').textContent = `Best score: ${this.best}`;
    }
  }

  showTimeUp() {
    this.screen = 'timeUp';
    const left = this.scene.differences.length - this.found.size;
    $('time-text').textContent =
      `The clock ran out on ${this.scene.name} with ${left} difference${left === 1 ? '' : 's'} still hidden. ` +
      `Score so far: ${this.score}.`;
    this.hideOverlays();
    $('overlay-time').classList.remove('hidden');
    this.updateHud();
  }

  // -- level flow -----------------------------------------------------------
  startLevel(index) {
    this.level = index;
    this.found = new Set();
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hint = null;
    this.wrong = null;
    this.cursor = { x: PANEL_W / 2, y: PANEL_H / 2, visible: false };
    this.timeLeft = this.scene.timeLimit;
    this.lastTick = performance.now();
    this.screen = 'playing';
    this.hideOverlays();
    this.updateHud();
    this.toast(`${this.scene.name} — find 7 differences!`);
  }

  nextLevel() {
    if (this.level + 1 < SCENES.length) this.startLevel(this.level + 1);
    else this.showWin();
  }

  // -- input ----------------------------------------------------------------
  bindInput() {
    const toScene = (event, canvas) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
        y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
      };
    };
    for (const canvas of [this.left, this.right]) {
      canvas.addEventListener('click', (event) => {
        if (this.screen !== 'playing') return;
        this.sound.ensure();
        this.checkPoint(toScene(event, canvas));
      });
      canvas.addEventListener('mousemove', (event) => {
        if (this.screen !== 'playing') return;
        this.cursor = { ...toScene(event, canvas), visible: true };
      });
    }
    document.addEventListener('keydown', (event) => {
      if (this.screen === 'title' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        this.startLevel(0);
        return;
      }
      if (this.screen !== 'playing') return;
      const step = event.shiftKey ? CURSOR_STEP * 3 : CURSOR_STEP;
      if (event.key === 'ArrowLeft') { this.cursor.x = Math.max(0, this.cursor.x - step); this.cursor.visible = true; event.preventDefault(); }
      else if (event.key === 'ArrowRight') { this.cursor.x = Math.min(PANEL_W, this.cursor.x + step); this.cursor.visible = true; event.preventDefault(); }
      else if (event.key === 'ArrowUp') { this.cursor.y = Math.max(0, this.cursor.y - step); this.cursor.visible = true; event.preventDefault(); }
      else if (event.key === 'ArrowDown') { this.cursor.y = Math.min(PANEL_H, this.cursor.y + step); this.cursor.visible = true; event.preventDefault(); }
      else if (event.key === 'Enter' || event.key === ' ') {
        this.cursor.visible = true;
        event.preventDefault();
        this.checkPoint({ x: this.cursor.x, y: this.cursor.y });
      } else if (event.key === 'h' || event.key === 'H') this.useHint();
      else if (event.key === 'm' || event.key === 'M') this.toggleSound();
      else if (event.key === 'r' || event.key === 'R') this.startLevel(this.level);
      else if (event.key === 'Escape') this.showTitle();
    });
    $('btn-hint').addEventListener('click', () => this.useHint());
    $('btn-sound').addEventListener('click', () => this.toggleSound());
    $('btn-restart').addEventListener('click', () => {
      if (this.screen === 'playing') this.startLevel(this.level);
    });
    $('btn-play').addEventListener('click', () => this.startLevel(0));
    $('btn-next').addEventListener('click', () => this.nextLevel());
    $('btn-again').addEventListener('click', () => {
      this.score = 0;
      this.startLevel(0);
    });
    $('btn-retry').addEventListener('click', () => this.startLevel(this.level));
  }

  buildLevelPicker() {
    const pick = $('level-pick');
    SCENES.forEach((scene, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = `${i + 1}. ${scene.name}`;
      btn.title = scene.blurb;
      btn.addEventListener('click', () => this.startLevel(i));
      pick.appendChild(btn);
    });
  }

  // -- play -----------------------------------------------------------------
  checkPoint(point) {
    const hit = this.scene.differences.find(
      (d) => !this.found.has(d.id) && Math.hypot(point.x - d.x, point.y - d.y) <= d.r + 6,
    );
    if (hit) {
      this.found.add(hit.id);
      this.score += POINTS_PER_FIND;
      this.sound.found();
      this.toast(`Found it — ${hit.label}! +${POINTS_PER_FIND}`);
      if (this.hint && this.hint.id === hit.id) this.hint = null;
      this.updateHud();
      if (this.found.size === this.scene.differences.length) this.showLevelComplete();
    } else {
      this.score = Math.max(0, this.score - WRONG_PENALTY);
      this.sound.wrong();
      this.wrong = { x: point.x, y: point.y };
      this.wrongAt = performance.now();
      this.toast(`Not there — −${WRONG_PENALTY}`);
      this.updateHud();
    }
  }

  useHint() {
    if (this.screen !== 'playing' || this.hintsLeft <= 0) return;
    const remaining = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    this.hint = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintUntil = performance.now() + HINT_SHOW_MS;
    this.sound.hint();
    this.toast('Hint: look inside the gold circle!');
    this.updateHud();
  }

  toggleSound() {
    this.sound.setMuted(!this.sound.muted);
    $('btn-sound').textContent = this.sound.muted ? 'Sound: off' : 'Sound: on';
  }

  toast(text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
  }

  updateHud() {
    const total = this.scene.differences.length;
    $('hud-level').textContent = `Level ${this.level + 1} / ${SCENES.length}`;
    $('hud-scene').textContent = this.scene.name;
    $('hud-found').textContent =
      `Found ${this.found.size} / ${total} · ${total - this.found.size} left`;
    $('hud-timer').textContent = fmtTime(this.timeLeft);
    $('hud-timer').classList.toggle('low', this.screen === 'playing' && this.timeLeft <= 30);
    $('hud-score').textContent = `Score ${this.score}`;
    $('hud-hints').textContent = `Hints ${this.hintsLeft}`;
    $('btn-hint').disabled = this.screen !== 'playing' || this.hintsLeft <= 0;
  }

  // -- frame loop -----------------------------------------------------------
  loop(now) {
    if (this.screen === 'playing' && !this.paused) {
      // Clamp the step so a stalled frame (or a tab that just came back)
      // can never eat more than a quarter of a second of clock.
      const dt = Math.min((now - this.lastTick) / 1000, 0.25);
      this.lastTick = now;
      const before = Math.ceil(this.timeLeft);
      this.timeLeft -= dt;
      if (this.timeLeft <= 30 && Math.ceil(this.timeLeft) !== before && this.timeLeft > 0) {
        this.sound.tick();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateHud();
        this.showTimeUp();
      } else if (Math.ceil(this.timeLeft) !== before) {
        this.updateHud();
      }
    } else {
      this.lastTick = now;
    }
    if (this.hint && now > this.hintUntil) this.hint = null;
    const marks = {
      found: this.found,
      hint: this.hint,
      hintPulse: now / 1000,
      wrong: this.wrong,
      wrongAge: this.wrong ? (now - this.wrongAt) / 500 : 1,
      cursor: this.cursor,
    };
    if (this.screen !== 'title') renderBoth(this.left, this.right, this.scene, marks);
    else renderBoth(this.left, this.right, SCENES[0], { ...marks, found: new Set(), cursor: { ...this.cursor, visible: false } });
    this.raf = requestAnimationFrame(this.loop);
  }
}
