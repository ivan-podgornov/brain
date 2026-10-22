import type { PickupHandle } from './handles';

/**
 * Интерфейс функций для работы с пикапами
 */
interface PickupsGlobal {
  /** Создает пикап */
  createPickup(
    this: void,
    modelId: number,
    pickupType: number,
    x: number,
    y: number,
    z: number
  ): PickupHandle;

  /** Удаляет пикап */
  removePickup(this: void, pickup: PickupHandle): void;

  /** Проверяет существование пикапа */
  doesPickupExist(this: void, pickup: PickupHandle): boolean;

  /** Проверяет, подобран ли пикап */
  hasPickupBeenCollected(this: void, pickup: PickupHandle): boolean;
}

declare const _G: PickupsGlobal;

export const { createPickup, removePickup, doesPickupExist, hasPickupBeenCollected } = _G;
