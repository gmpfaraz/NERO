import * as Tone from 'tone';

// ============================================
// AUDIO FEEDBACK SYSTEM
// ============================================

class AudioFeedbackService {
  private static instance: AudioFeedbackService;
  private initialized = false;
  private enabled = true;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): AudioFeedbackService {
    if (!AudioFeedbackService.instance) {
      AudioFeedbackService.instance = new AudioFeedbackService();
    }
    return AudioFeedbackService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Tone.start();
      this.initialized = true;
    } catch (err) {
      console.warn('Audio feedback initialization failed:', err);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // ============================================
  // SOUND EFFECTS
  // ============================================

  /**
   * Play success sound (transaction added)
   */
  async playSuccess(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.5 },
      }).toDestination();

      synth.triggerAttackRelease('C5', '0.1', Tone.now());
      synth.triggerAttackRelease('E5', '0.1', Tone.now() + 0.1);

      // Cleanup after sound finishes
      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play error sound
   */
  async playError(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.3 },
      }).toDestination();

      synth.triggerAttackRelease('E3', '0.2', Tone.now());

      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play delete sound
   */
  async playDelete(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.3 },
      }).toDestination();

      synth.triggerAttackRelease('G3', '0.15', Tone.now());

      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play click sound (button press)
   */
  async playClick(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
      }).toDestination();

      synth.triggerAttackRelease('A4', '0.05', Tone.now());

      setTimeout(() => synth.dispose(), 500);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play notification sound
   */
  async playNotification(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 },
      }).toDestination();

      synth.triggerAttackRelease('A4', '0.1', Tone.now());
      synth.triggerAttackRelease('E5', '0.1', Tone.now() + 0.15);

      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play undo sound
   */
  async playUndo(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 },
      }).toDestination();

      synth.triggerAttackRelease('D4', '0.1', Tone.now());
      synth.triggerAttackRelease('A3', '0.1', Tone.now() + 0.1);

      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play redo sound
   */
  async playRedo(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 },
      }).toDestination();

      synth.triggerAttackRelease('A3', '0.1', Tone.now());
      synth.triggerAttackRelease('D4', '0.1', Tone.now() + 0.1);

      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }

  /**
   * Play completion sound (bulk operation)
   */
  async playCompletion(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 },
      }).toDestination();

      synth.triggerAttackRelease('C4', '0.1', Tone.now());
      synth.triggerAttackRelease('E4', '0.1', Tone.now() + 0.1);
      synth.triggerAttackRelease('G4', '0.2', Tone.now() + 0.2);

      setTimeout(() => synth.dispose(), 1000);
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }
}

// Export singleton instance
export const audioFeedback = AudioFeedbackService.getInstance();

// Convenience functions
export const playSuccessSound = () => audioFeedback.playSuccess();
export const playErrorSound = () => audioFeedback.playError();
export const playDeleteSound = () => audioFeedback.playDelete();
export const playClickSound = () => audioFeedback.playClick();
export const playNotificationSound = () => audioFeedback.playNotification();
export const playUndoSound = () => audioFeedback.playUndo();
export const playRedoSound = () => audioFeedback.playRedo();
export const playCompletionSound = () => audioFeedback.playCompletion();

