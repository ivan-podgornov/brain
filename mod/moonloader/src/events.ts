/**
 * Интерфейс событий MoonLoader
 */
export type Events = {
  /** Вызывается при завершении скрипта */
  onScriptTerminate: [];
  /** Вызывается каждый кадр */
  onFrame: [];
  /** Вызывается при спавне игрока */
  onPlayerSpawn: [];
  /** Вызывается при входе в транспорт */
  onVehicleEnter: [vehicleId: number];
  /** Вызывается при выходе из транспорта */
  onVehicleExit: [vehicleId: number];
  /** Вызывается при изменении интерьера */
  onInteriorChanged: [interiorId: number];
};

export type EventCallback<Event extends keyof Events> = (...args: Events[Event]) => void;

/**
 * Интерфейс функций для работы с событиями в MoonLoader
 */
interface EventsGlobal {
  /** Добавляет обработчик события */
  addEventHandler<Event extends keyof Events>(
    this: void,
    event: Event,
    callback: EventCallback<Event>
  ): void;
}

declare const _G: EventsGlobal;

export const { addEventHandler } = _G;
