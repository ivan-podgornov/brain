import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';
import type { Vector3 } from '../src';

describe('Geometry', () => {
  describe('#moveTowards', () => {
    it('Если до цели дальше, чем maxDistance, возвращает точку, сдвинутую на maxDistance', () => {
      const current: Vector3 = { x: 0, y: 0, z: 0 };
      const target: Vector3 = { x: 10, y: 0, z: 0 };
      const geometry = new Geometry();

      const result = geometry.moveTowards(current, target, 3);

      expect(result).toStrictEqual({ x: 3, y: 0, z: 0 });
    });

    it('Сдвигает точку по прямой к цели по всем осям', () => {
      const current: Vector3 = { x: 0, y: 0, z: 0 };
      const target: Vector3 = { x: 4, y: 6, z: 12 };
      const geometry = new Geometry();

      const result = geometry.moveTowards(current, target, 7);

      expect(result).toStrictEqual({ x: 2, y: 3, z: 6 });
    });

    it('Если до цели ближе, чем maxDistance, возвращает цель', () => {
      const current: Vector3 = { x: 0, y: 0, z: 0 };
      const target: Vector3 = { x: 1, y: 1, z: 1 };
      const geometry = new Geometry();

      const result = geometry.moveTowards(current, target, 10);

      expect(result).toStrictEqual(target);
    });

    it('Если до цели ровно maxDistance, возвращает цель', () => {
      const current: Vector3 = { x: 0, y: 0, z: 0 };
      const target: Vector3 = { x: 3, y: 4, z: 0 };
      const geometry = new Geometry();

      const result = geometry.moveTowards(current, target, 5);

      expect(result).toStrictEqual(target);
    });

    it('Если точки совпадают, возвращает цель', () => {
      const current: Vector3 = { x: 2, y: 2, z: 2 };
      const target: Vector3 = { x: 2, y: 2, z: 2 };
      const geometry = new Geometry();

      const result = geometry.moveTowards(current, target, 5);

      expect(result).toStrictEqual(target);
    });

    it('Если maxDistance равен 0, возвращает текущую точку', () => {
      const current: Vector3 = { x: 0, y: 0, z: 0 };
      const target: Vector3 = { x: 10, y: 0, z: 0 };
      const geometry = new Geometry();

      const result = geometry.moveTowards(current, target, 0);

      expect(result).toStrictEqual(current);
    });
  });
});
