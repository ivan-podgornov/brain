import type { FireHandle } from './handles';

/**
 * Интерфейс функций для работы с миром в MoonLoader
 */
interface WorldGlobal {
  /** Устанавливает погоду */
  setWeather(this: void, weatherId: number): void;

  /** Получает текущую погоду */
  getCurrentWeather(this: void): number;

  /** Форсирует погоду */
  forceWeather(this: void, weatherId: number): void;

  /** Форсирует погоду сейчас */
  forceWeatherNow(this: void, weatherId: number): void;

  /** Выключает погоду */
  releaseWeather(this: void): void;

  /** Устанавливает время суток */
  setTimeOfDay(this: void, hours: number, minutes: number): void;

  /** Получает время суток */
  getTimeOfDay(this: void): LuaMultiReturn<[number, number]>;

  /** Получает минуты до следующего часа */
  getMinutesToTimeOfDay(this: void, hours: number, minutes: number): number;

  /** Сохраняет время суток */
  storeClockState(this: void): void;

  /** Восстанавливает время суток */
  restoreClockState(this: void): void;

  /** Устанавливает гравитацию */
  setGravity(this: void, gravity: number): void;

  /** Устанавливает скорость игры */
  setTimeScale(this: void, scale: number): void;

  /** Получает расстояние между координатами 2D */
  getDistanceBetweenCoords2d(this: void, x1: number, y1: number, x2: number, y2: number): number;

  /** Получает расстояние между координатами 3D */
  getDistanceBetweenCoords3d(
    this: void,
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): number;

  /** Получает угол между координатами */
  getHeadingFromVector2d(this: void, x: number, y: number): number;

  /** Находит наземную Z-координату для точки */
  getGroundZFor3dCoord(this: void, x: number, y: number, z: number): number;

  /** Создает взрыв */
  addExplosion(this: void, x: number, y: number, z: number, type: number): void;

  /** Создает огонь */
  startScriptFire(this: void, x: number, y: number, z: number): FireHandle;

  /** Удаляет огонь */
  removeScriptFire(this: void, fire: FireHandle): void;

  /** Проверяет существование огня */
  isScriptFireExtinguished(this: void, fire: FireHandle): boolean;
}

declare const _G: WorldGlobal;

export const {
  setWeather,
  getCurrentWeather,
  forceWeather,
  forceWeatherNow,
  releaseWeather,
  setTimeOfDay,
  getTimeOfDay,
  getMinutesToTimeOfDay,
  storeClockState,
  restoreClockState,
  setGravity,
  setTimeScale,
  getDistanceBetweenCoords2d,
  getDistanceBetweenCoords3d,
  getHeadingFromVector2d,
  getGroundZFor3dCoord,
  addExplosion,
  startScriptFire,
  removeScriptFire,
  isScriptFireExtinguished,
} = _G;
