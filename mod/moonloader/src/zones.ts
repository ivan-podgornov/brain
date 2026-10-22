/**
 * Интерфейс функций для работы с зонами и городами
 */
interface ZonesGlobal {
  /** Получает название зоны по координатам */
  getNameOfZone(this: void, x: number, y: number, z: number): string;

  /** Получает название города (this: void, info zone) по координатам */
  getNameOfInfoZone(this: void, x: number, y: number, z: number): string;

  /** Получает текущее значение зоны для игрока */
  getCurrentZoneScavengerValue(this: void): number;
}

declare const _G: ZonesGlobal;

export const { getNameOfZone, getNameOfInfoZone, getCurrentZoneScavengerValue } = _G;
