// Twin Garden — sound. Every sound is synthesised with WebAudio oscillators;
// the game ships no audio files and makes no network request.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  // Browsers only let audio start after a user gesture; create lazily.
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  tone(freq, startIn, dur, type, vol) {
    if (this.muted || !this.ensure()) return;
    const t0 = this.ctx.currentTime + startIn;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A bright two-note chime when a difference is found.
  found() {
    this.tone(659.25, 0, 0.16, 'sine', 0.22);
    this.tone(987.77, 0.09, 0.28, 'sine', 0.22);
  }

  // A low buzz for a wrong click.
  wrong() {
    this.tone(110, 0, 0.18, 'square', 0.12);
    this.tone(98, 0.05, 0.18, 'square', 0.1);
  }

  // A soft blip when a hint is used.
  hint() {
    this.tone(880, 0, 0.12, 'triangle', 0.16);
    this.tone(1174.66, 0.08, 0.16, 'triangle', 0.14);
  }

  // A rising arpeggio when a scene is finished.
  levelComplete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.11, 0.3, 'triangle', 0.2));
  }

  // A longer fanfare for finishing all three scenes.
  win() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      this.tone(f, i * 0.12, 0.34, 'triangle', 0.2));
  }

  // A short tick when the clock is nearly out.
  tick() {
    this.tone(1200, 0, 0.05, 'square', 0.05);
  }

  setMuted(muted) {
    this.muted = muted;
  }
}
