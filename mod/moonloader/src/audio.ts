/**
 * Интерфейс аудио-функций MoonLoader
 */
interface AudioGlobal {
  /** Загружает аудиопоток */
  loadAudioStream(this: void, url: string): number;

  /** Проигрывает аудиопоток */
  playAudioStream(this: void, stream: number): void;

  /** Останавливает аудиопоток */
  stopAudioStream(this: void, stream: number): void;

  /** Получает длину аудиопотока */
  getAudioStreamLength(this: void, stream: number): number;

  /** Устанавливает громкость аудиопотока */
  setAudioStreamVolume(this: void, stream: number, volume: number): void;

  /** Получает состояние аудиопотока */
  getAudioStreamState(this: void, stream: number): number;

  /** Воспроизводит звуковой эффект */
  playSoundFrontend(this: void, soundId: number): void;

  /** Воспроизводит звук на позиции */
  addOneOffSound(this: void, x: number, y: number, z: number, soundId: number): void;
}

declare const _G: AudioGlobal;

export const {
  loadAudioStream,
  playAudioStream,
  stopAudioStream,
  getAudioStreamLength,
  setAudioStreamVolume,
  getAudioStreamState,
  playSoundFrontend,
  addOneOffSound,
} = _G;
