import type { IGeometry, Vector2, Vector3 } from './types';

export class Geometry implements IGeometry {
  getDistance2d(pointA: Vector2, pointB: Vector2): number {
    const x = Math.pow(pointB.x - pointA.x, 2);
    const y = Math.pow(pointB.y - pointA.y, 2);

    return Math.sqrt(x + y);
  }

  getDistance3d(pointA: Vector3, pointB: Vector3): number {
    const x = Math.pow(pointB.x - pointA.x, 2);
    const y = Math.pow(pointB.y - pointA.y, 2);
    const z = Math.pow(pointB.z - pointA.z, 2);

    return Math.sqrt(x + y + z);
  }

  isWithinRadius2d(point: Vector2, center: Vector2, radius: number): boolean {
    return this.getDistance2d(point, center) <= radius;
  }

  isWithinRadius3d(point: Vector3, center: Vector3, radius: number): boolean {
    return this.getDistance3d(point, center) <= radius;
  }

  moveTowards(current: Vector3, target: Vector3, maxDistance: number): Vector3 {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const dz = target.z - current.z;
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

    if (distance <= maxDistance || distance === 0) {
      return { ...target };
    }

    const ratio = maxDistance / distance;

    return {
      x: current.x + dx * ratio,
      y: current.y + dy * ratio,
      z: current.z + dz * ratio,
    };
  }
}
