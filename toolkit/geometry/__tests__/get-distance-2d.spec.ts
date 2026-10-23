import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector2, Vector3 } from '../src';

describe('Geometry', () => {
  describe('#getDistance2d', () => {
    it('Возвращает 0, если точки совпадают', () => {
      const point: Vector2 = { x: 5, y: -3 };
      const geometry = new Geometry();

      const distance = geometry.getDistance2d(point, point);

      expect(distance).toBe(0);
    });

    it('Возвращает расстояние по прямой между точками', () => {
      const a: Vector2 = { x: 0, y: 0 };
      const b: Vector2 = { x: 3, y: 4 };
      const geometry = new Geometry();

      const distance = geometry.getDistance2d(a, b);

      expect(distance).toBe(5);
    });

    it('Возвращает одинаковый результат независимо от порядка точек', () => {
      const a: Vector2 = { x: 1, y: 2 };
      const b: Vector2 = { x: 3, y: 4 };
      const geometry = new Geometry();

      const distanceFromAtoB = geometry.getDistance2d(a, b);
      const distanceFromBtoA = geometry.getDistance2d(b, a);

      expect(distanceFromAtoB).toBe(distanceFromBtoA);
    });

    it('Если координаты отрицательные, возвращает положительное расстояние', () => {
      const a: Vector2 = { x: -3, y: -4 };
      const b: Vector2 = { x: 0, y: 0 };
      const geometry = new Geometry();

      const distance = geometry.getDistance2d(a, b);

      expect(distance).toBe(5);
    });

    it('Если у точки есть высота, не учитывает её', () => {
      const a: Vector3 = { x: 0, y: 0, z: 0 };
      const b: Vector3 = { x: 3, y: 4, z: 100 };
      const geometry = new Geometry();

      const distance = geometry.getDistance2d(a, b);

      expect(distance).toBe(5);
    });
  });
});
