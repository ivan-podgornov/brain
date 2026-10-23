export type Vector2 = { x: number; y: number };

export type Vector3 = { x: number; y: number; z: number };

export interface IGeometry {
  /** Возвращает дистанцию между двумя точками в двумерном пространстве */
  getDistance2d(pointA: Vector2, pointB: Vector2): number;

  /** Возвращает дистанцию между двумя точками в трёхмерном пространстве */
  getDistance3d(pointA: Vector3, pointB: Vector3): number;

  /**
   * Проверяет, находится ли точка в указанном радиусе от центра на плоскости, без учёта высоты
   * @param point - точка, которую проверяем
   * @param center - точка, относительно которой проверяем радиус
   * @param radius - радиус в котором должна находиться точка
   */
  isWithinRadius2d(point: Vector2, center: Vector2, radius: number): boolean;

  /**
   * Проверяет, находится ли точка в указанном радиусе по отношению к указанному центру
   * @param point - точка, которую проверяем
   * @param center - точка, относительно которой проверяем радиус
   * @param radius - радиус в котором должна находиться точка
   */
  isWithinRadius3d(point: Vector3, center: Vector3, radius: number): boolean;

  /**
   * Возвращает точку, сдвинутую от `current` в сторону `target` на `maxDistance`
   * Если до цели ближе, чем `maxDistance`, возвращает цель
   */
  moveTowards(current: Vector3, target: Vector3, maxDistance: number): Vector3;
}
