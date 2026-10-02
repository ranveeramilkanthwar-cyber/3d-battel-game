// ==========================================================================
// GARGOYLE'S KEEP: WEB AUDIO PROCEDURAL SOUND ENGINE
// Atmospheric Gothic Ambience, Dynamic Spell SFX, and Lovable Reactions
// ==========================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientGain = null;
    this.sfxGain = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);

      // Ambient Gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      this.startAmbientDrone();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.sfxGain && this.ambientGain) {
      const targetGain = this.muted ? 0 : 0.55;
      const targetAmb = this.muted ? 0 : 0.18;
      this.sfxGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
      this.ambientGain.gain.linearRampToValueAtTime(targetAmb, this.ctx.currentTime + 0.1);
    }
    return this.muted;
  }

  startAmbientDrone() {
    if (this.isAmbientPlaying || !this.ctx) return;
    this.isAmbientPlaying = true;

    // Atmospheric Gothic chord: D minor / F / A with gentle pitch modulation
    const frequencies = [73.42, 110.0, 146.83, 220.0]; // D2, A2, D3, A3
    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 + idx * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.25 / (idx + 1), this.ctx.currentTime);

      // LFO for slow eerie breathing effect
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();
    });
  }

  playShootSound(towerType) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    if (towerType === 'gargoyle') {
      // Fireball whoosh & spit
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.22);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (towerType === 'cauldron') {
      // Slime bubble burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (towerType === 'tesla') {
      // Electric crackle / lightning arc
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (towerType === 'crypt') {
      // Ghostly breath
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  playHitSound() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playSoulCollectSound() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    // Harmonic crystal bell chime
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.22, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.45);
    });
  }

  playBuildSound() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    // Heavy stone lock-in clack
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playSpellSound(spell) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    if (spell === 'meteor') {
      // Deep thunderous crash
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.8);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (spell === 'freeze') {
      // Ice crystallize chime
      [659.25, 783.99, 987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.28, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.6);
      });
    } else if (spell === 'frenzy') {
      // Blood moon war horn
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.9);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.9);
    }
  }

  playPetSound(towerType) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    if (towerType === 'gargoyle') {
      // Grumpy playful gargoyle purr / grumble
      [90, 110, 85, 120].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.1);
      });
    } else if (towerType === 'cauldron') {
      // Joyous bubbly giggle
      [280, 360, 420, 500].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.22, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.09);
      });
    } else {
      // Pleasant resonant chime
      this.playSoulCollectSound();
    }
  }

  playVictorySound() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.8);
    });
  }

  playDefeatSound() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const notes = [311.13, 293.66, 277.18, 220.00]; // Somber descending
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.25);

      gain.gain.setValueAtTime(0.35, now + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 0.9);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 0.9);
    });
  }
}

export const sound = new SoundEngine();
