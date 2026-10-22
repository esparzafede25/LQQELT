/**
 * LO QUE QUEDÓ EN LA TIERRA
 * StorageManager — Gestión de persistencia de progreso y configuración local
 */

export class StorageManager {
  static STORAGE_KEY = 'lo_que_quedo_en_la_tierra_save_v1';

  static DEFAULT_STATE = {
    PRESENT_ROOM: null,
    PRESENT_THIRD_STEP: null,
    OPENING_COMPLETED: false,
    PRESENT_WASHED: false,
    PRESENT_MEMORY_RETURN: false,
    PRESENT_RETURN_SCENE: null,
    INTRO_COMPLETED: false,
    MATE_COMPLETED: false,
    CAR_COMPLETED: false,
    RADIO_COMPLETED: false,
    RADIO_RETURN_PENDING: false,
    LETTER_SEQUENCE_UNLOCKED: false,
    DEPARTURE_STARTED: false,
    DEPARTURE_AT_CAR: false,
    DEPARTURE_PACKED_ITEMS: [],
    DEPARTURE_FILM_STEP: null,
    DEPARTURE_CAR_STARTED: false,
    DEPARTURE_CAR_STAGE: null,
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
    return Boolean(this.state.DEPARTURE_STARTED || this.state.LETTER_SEQUENCE_UNLOCKED || this.state.GAME_COMPLETED || (Number.isInteger(this.state.PRESENT_THIRD_STEP) && this.state.PRESENT_THIRD_STEP >= 0 && this.state.PRESENT_THIRD_STEP <= 6) || this.state.PRESENT_ROOM || this.state.INTRO_COMPLETED || this.state.MATE_COMPLETED || this.state.CAR_COMPLETED || this.state.RADIO_COMPLETED);
  }

  getLatestUnlockedScene() {
    if (this.state.GAME_COMPLETED) return 'EPILOGUE';
    if (this.state.DEPARTURE_CAR_STARTED) return 'CAR_DEPARTURE';
    if (this.state.DEPARTURE_STARTED) return 'DEPARTURE';
    if (this.state.RADIO_RETURN_PENDING) return 'PRESENT_KITCHEN_THIRD';
    if (this.state.LETTER_SEQUENCE_UNLOCKED) return 'ENVELOPE';
    if (this.state.PRESENT_ROOM === 'kitchen' && this.state.PRESENT_RETURN_SCENE === 'PRESENT_KITCHEN_THIRD') return 'PRESENT_KITCHEN_THIRD';
    if (Number.isInteger(this.state.PRESENT_THIRD_STEP) && this.state.PRESENT_THIRD_STEP >= 0 && this.state.PRESENT_THIRD_STEP <= 6) return 'PRESENT_THIRD_PREVIEW';
    if (this.state.RADIO_COMPLETED || this.state.CAR_COMPLETED || this.state.MATE_COMPLETED) return 'PRESENT_KITCHEN_THIRD';
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
