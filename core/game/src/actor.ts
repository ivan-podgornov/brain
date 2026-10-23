import type { Observable } from '@brain/events';
import type { Vector3 } from '@brain/geometry';

export interface IActor {
  /** Возвращает позицию персонажа в игре */
  getPosition(): Vector3;

  /** Устанавливает позицию персонажа в игре */
  setPosition(position: Vector3): void;

  /**
   * Заставляет персонажа идти к определённым координатам. Возвращает observable, который будет
   * выполнен, когда персонаж окажется в ожидаемом радиусе от нужных координат. Observable будет
   * сообщать всем наблюдателям текущие координаты персонажа по мере приближения к точке.
   * @param coords - координаты к которым нужно прийти
   * @param completeRadius - радиус, при котором можно считать, что персонаж пришел к нужным координатам
   */
  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3>;

  /** Деспавнит игрового персонажа */
  despawn(): void;
}

export type CreateActorOptions = {
  /** ID игровой модели */
  modelId: number;
  /** Позиция, на которой нужно заспавнить персонажа */
  position: Vector3;
};

export interface IActorFactory {
  /** Создаёт игрового персонажа */
  create(options: CreateActorOptions): IActor;
}
