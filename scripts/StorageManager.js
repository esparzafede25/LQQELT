/**
 * LO QUE QUEDÓ EN LA TIERRA
 * StorageManager — Gestión de persistencia de progreso y configuración local
 */

export class StorageManager {
  static STORAGE_KEY = 'lo_que_quedo_en_la_tierra_save_v1';

  static DEFAULT_STATE = {
    INTRO_COMPLETED: false,
    MATE_COMPLETED: false,
    CAR_COMPLETED: false,
    RADIO_COMPLETED: false,
    LETTER_SEQUENCE_UNLOCKED: false,
    GAME_COMPLETED: false,
    soundEnabled: true,
    volume: 0.8,
    stopMotionCadence: true
  };

  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(StorageManager.STORAGE_KEY);
      if (saved) {
        return { ...StorageManager.DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return { ...StorageManager.DEFAULT_STATE };
  }

  save() {
    try {
      localStorage.setItem(StorageManager.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
  }

  set(key, value) {
    this.state[key] = value;
    this.save();
  }

  get(key) {
    return this.state[key];
  }

  hasSavedGame() {
    return this.state.INTRO_COMPLETED || this.state.MATE_COMPLETED;
  }

  getLatestUnlockedScene() {
    if (this.state.GAME_COMPLETED) return 'EPILOGUE';
    if (this.state.LETTER_SEQUENCE_UNLOCKED) return 'ENVELOPE';
    if (this.state.RADIO_COMPLETED) return 'WORKSHOP_FINAL';
    if (this.state.CAR_COMPLETED) return 'WORKSHOP_RADIO';
    if (this.state.MATE_COMPLETED) return 'WORKSHOP_CAR';
    if (this.state.INTRO_COMPLETED) return 'INTRO';
    return 'INTRO';
  }

  resetProgress() {
    const sound = this.state.soundEnabled;
    const vol = this.state.volume;
    this.state = {
      ...StorageManager.DEFAULT_STATE,
      soundEnabled: sound,
      volume: vol
    };
    this.save();
  }
}
