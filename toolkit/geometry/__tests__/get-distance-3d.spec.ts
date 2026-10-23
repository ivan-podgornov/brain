import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector3 } from '../src';

describe('Geometry', () => {
  describe('#getDistance3d', () => {
    it('Возвращает 0, если точки совпадают', () => {
      const point: Vector3 = { x: 5, y: -3, z: 2 };
      const geometry = new Geometry();

      const distance = geometry.getDistance3d(point, point);

      expect(distance).toBe(0);
    });

    it('Возвращает расстояние по прямой между точками', () => {
      const a: Vector3 = { x: 0, y: 0, z: 0 };
      const b: Vector3 = { x: 2, y: 3, z: 6 };
      const geometry = new Geometry();

      const distance = geometry.getDistance3d(a, b);

      expect(distance).toBe(7);
    });

    it('Возвращает одинаковый результат независимо от порядка точек', () => {
      const a: Vector3 = { x: 1, y: 2, z: 3 };
      const b: Vector3 = { x: 7, y: 10, z: -4 };
      const geometry = new Geometry();

      const distanceFromAtoB = geometry.getDistance3d(a, b);
      const distanceFromBtoA = geometry.getDistance3d(b, a);

      expect(distanceFromAtoB).toBe(distanceFromBtoA);
    });

    it('Если координаты отрицательные, возвращает положительное расстояние', () => {
      const a: Vector3 = { x: -2, y: -3, z: -6 };
      const b: Vector3 = { x: 0, y: 0, z: 0 };
      const geometry = new Geometry();

      const distance = geometry.getDistance3d(a, b);

      expect(distance).toBe(7);
    });

    it('Если точки различаются только по высоте, возвращает разницу высот', () => {
      const a: Vector3 = { x: 1, y: 1, z: 0 };
      const b: Vector3 = { x: 1, y: 1, z: 5 };
      const geometry = new Geometry();

      const distance = geometry.getDistance3d(a, b);

      expect(distance).toBe(5);
    });
  });
});
