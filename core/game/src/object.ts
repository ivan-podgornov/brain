import type { Vector3 } from '@brain/geometry';

export interface IObject {
  /** Замораживает объект на текущей позиции */
  freeze(): void;

  /**
   * Включает или отключает физику для объекта.
   * Если передать false, сквозь него будут пролетать пули, проезжать машины и проходить персонажи
   */
  setCollisionEnabled(enabled: boolean): void;

  /** Возвращает позицию объекта в игровом мире */
  getPosition(): Vector3;

  /** Устанавливает позицию для объекта в игровом мире */
  setPosition(position: Vector3): void;

  /** Показывает или скрывает объект. Коллизия при этом остаётся */
  setVisibility(visible: boolean): void;

  /** Удаляет объект из игры */
  remove(): void;
}

export type CreateObjectOptions = {
  /** ID игровой модели */
  modelId: number;
  /** Позиция, на которой нужно разместить объект */
  position: Vector3;
};

export interface IObjectFactory {
  /** Создаёт игровой объект */
  create(options: CreateObjectOptions): IObject;
}
