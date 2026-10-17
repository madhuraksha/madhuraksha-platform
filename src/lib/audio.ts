export class HiveAudioStreamer {
  private audioCtx: AudioContext | null = null;
  public isPlaying = false;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private animationFrameId: number | null = null;
  private volume = 0.5;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public calculateFrequencyFromDb(soundDb: number): number {
    // 50 dB -> 200 Hz (relaxed colony hum)
    // 63 dB -> 220 Hz (active worker foraging)
    // 75 dB -> 310 Hz (elevated agitation)
    // 85 dB -> 380 Hz (piping / swarming buzz)
    const normalized = Math.max(0, Math.min(1, (soundDb - 50) / 40));
    return 200 + normalized * 180;
  }

  public startBuzz(soundDb = 63, canvas: HTMLCanvasElement | null = null): number {
    this.initAudioContext();
    if (!this.audioCtx || this.isPlaying) return 220;

    const baseFreq = this.calculateFrequencyFromDb(soundDb);

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.35, this.audioCtx.currentTime);

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;

    // Primary fundamental oscillator (sawtooth simulates rapid wing stroke)
    this.osc1 = this.audioCtx.createOscillator();
    this.osc1.type = "sawtooth";
    this.osc1.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

    // Secondary harmonic overtone
    this.osc2 = this.audioCtx.createOscillator();
    this.osc2.type = "triangle";
    this.osc2.frequency.setValueAtTime(baseFreq * 2.05, this.audioCtx.currentTime);

    // Create subtle turbulent air noise buffer
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noiseNode = this.audioCtx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(baseFreq * 1.5, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(3.0, this.audioCtx.currentTime);

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

    this.noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.gainNode);

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.osc1.start();
    this.osc2.start();
    this.noiseNode.start();
    this.isPlaying = true;

    if (canvas) {
      this.drawOscilloscope(canvas);
    }

    return baseFreq;
  }

  public stopBuzz() {
    if (!this.isPlaying) return;

    try {
      this.osc1?.stop();
      this.osc2?.stop();
      this.noiseNode?.stop();
      this.osc1?.disconnect();
      this.osc2?.disconnect();
      this.noiseNode?.disconnect();
    } catch {
      // ignore
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isPlaying = false;
  }

  public updateLiveSound(soundDb: number) {
    if (!this.isPlaying || !this.audioCtx) return;
    const newFreq = this.calculateFrequencyFromDb(soundDb);
    const now = this.audioCtx.currentTime;
    this.osc1?.frequency.exponentialRampToValueAtTime(Math.max(100, newFreq), now + 0.3);
    this.osc2?.frequency.exponentialRampToValueAtTime(Math.max(200, newFreq * 2.05), now + 0.3);
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(vol * 0.35, this.audioCtx.currentTime);
    }
  }

  public drawOscilloscope(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!this.isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      this.animationFrameId = requestAnimationFrame(render);
      this.analyser!.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#d97706";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(245, 158, 11, 0.4)";

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();
  }
}
