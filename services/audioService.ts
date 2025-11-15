class AudioService {
  private audioContext: AudioContext | null = null;
  public isMuted: boolean = false;

  public init() {
    if (this.audioContext === null) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  private playSound(type: OscillatorType, frequency: number, duration: number, volume: number = 0.5) {
    if (!this.audioContext || this.isMuted) return;
    
    // Resume context if it's suspended
    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  public playShootSound() {
    this.playSound('triangle', 523.25, 0.1, 0.3); // C5
  }

  public playHitSound() {
    this.playSound('square', 261.63, 0.15, 0.4); // C4
  }
  
  public playBossDefeatSound() {
    this.playSound('sine', 783.99, 0.5, 0.6); // G5
  }

  public playBossShootSound() {
    this.playSound('sawtooth', 220, 0.2, 0.4); // A3
  }

  public playPlayerHitSound() {
    this.playSound('sawtooth', 130.81, 0.3, 0.5); // C3
  }

  public playGameOverSound() {
    this.playSound('sine', 110, 0.7, 0.6); // A2
  }

  public playLevelUpSound() {
    this.playSound('sine', 659.25, 0.3, 0.5); // E5
  }
}

export const audioService = new AudioService();