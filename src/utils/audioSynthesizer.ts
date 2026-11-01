// Interactive Web Audio synth player so songs can actually be heard in the browser

class AudioPreviewPlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private currentSongId: string | null = null;
  private timerId: number | null = null;
  private currentSeconds = 0;
  private totalSeconds = 180;
  private onStateChange: ((isPlaying: boolean, songId: string | null, currentTime: number, duration: number) => void) | null = null;
  private localAudioElement: HTMLAudioElement | null = null;

  public subscribe(cb: (isPlaying: boolean, songId: string | null, currentTime: number, duration: number) => void) {
    this.onStateChange = cb;
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange(this.isPlaying, this.currentSongId, this.currentSeconds, this.totalSeconds);
    }
  }

  public playSong(songId: string, title: string, durationSec: number = 180, toneType: 'chords' | 'lofi' | 'ambient' = 'lofi', customBlobUrl?: string) {
    // If playing another song, stop first
    if (this.isPlaying) {
      this.stop();
    }

    this.currentSongId = songId;
    this.totalSeconds = durationSec > 0 ? durationSec : 180;
    this.currentSeconds = 0;
    this.isPlaying = true;

    if (customBlobUrl) {
      try {
        if (!this.localAudioElement) {
          this.localAudioElement = new Audio();
        }
        this.localAudioElement.src = customBlobUrl;
        this.localAudioElement.play().catch(() => {});
        this.localAudioElement.ontimeupdate = () => {
          if (this.localAudioElement) {
            this.currentSeconds = Math.floor(this.localAudioElement.currentTime);
            this.totalSeconds = Math.floor(this.localAudioElement.duration) || this.totalSeconds;
            this.notify();
          }
        };
        this.localAudioElement.onended = () => {
          this.stop();
        };
      } catch (err) {
        console.warn('Fallback to synth player', err);
      }
    } else {
      this.startSynthesizerGroove(toneType);
    }

    this.notify();

    this.timerId = window.setInterval(() => {
      if (this.isPlaying) {
        this.currentSeconds += 1;
        if (this.currentSeconds >= this.totalSeconds) {
          this.stop();
        } else {
          this.notify();
        }
      }
    }, 1000);
  }

  private startSynthesizerGroove(toneType: 'chords' | 'lofi' | 'ambient') {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Generate a pleasant gentle warm chord cadence
      const now = this.audioCtx.currentTime;
      const chords = toneType === 'lofi'
        ? [[261.63, 311.13, 392.00, 466.16], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 349.23]] // Cm7, Am7, Fmaj7, G7
        : [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 392.00]]; // Cmaj7, Am7, Fmaj7, G

      let chordIndex = 0;
      const playNextChord = () => {
        if (!this.isPlaying || !this.audioCtx || this.audioCtx.state === 'closed') return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          osc.type = toneType === 'lofi' ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(toneType === 'lofi' ? 850 : 1200, this.audioCtx.currentTime);

          const startGain = idx === 0 ? 0.05 : 0.03;
          gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(startGain, this.audioCtx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 3.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(this.audioCtx.currentTime);
          osc.stop(this.audioCtx.currentTime + 4.0);
        });

        if (this.isPlaying) {
          window.setTimeout(playNextChord, 3600);
        }
      };

      playNextChord();
    } catch {
      // Audio autoplay restrictions or headless environment
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentSongId = null;
    this.currentSeconds = 0;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.localAudioElement) {
      try {
        this.localAudioElement.pause();
        this.localAudioElement.currentTime = 0;
      } catch {}
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.suspend();
      } catch {}
    }
    this.notify();
  }

  public togglePlay(songId: string, title: string, durationSec: number = 180, toneType: 'chords' | 'lofi' | 'ambient' = 'lofi') {
    if (this.isPlaying && this.currentSongId === songId) {
      this.stop();
    } else {
      this.playSong(songId, title, durationSec, toneType);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentSongId: this.currentSongId,
      currentSeconds: this.currentSeconds,
      totalSeconds: this.totalSeconds
    };
  }
}

export const globalAudioPlayer = new AudioPreviewPlayer();
