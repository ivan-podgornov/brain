/**
 * Интерфейс математических функций MoonLoader
 */
interface MathGlobal {
  /** Получает случайное число */
  generateRandomFloatInRange(this: void, min: number, max: number): number;

  /** Получает случайное целое число */
  generateRandomIntInRange(this: void, min: number, max: number): number;

  /** Ограничивает угол от 0 до 360 */
  limitAngle(this: void, angle: number): number;
}

declare const _G: MathGlobal;

export const { generateRandomFloatInRange, generateRandomIntInRange, limitAngle } = _G;
