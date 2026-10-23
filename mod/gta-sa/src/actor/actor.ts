import { Observable } from '@brain/events';
import type { ISubscriber } from '@brain/events';
import type { CreateActorOptions, IActor } from '@brain/game';
import type { IGeometry, Vector3 } from '@brain/geometry';
import type { PedHandle } from '@brain/moonloader';

import {
  clearCharTasksImmediately,
  createChar,
  deleteChar,
  doesCharExist,
  dontRemoveChar,
  getCharCoordinates,
  loadAllModelsNow,
  markModelAsNoLongerNeeded,
  requestModel,
  setCharCoordinates,
  taskGoToObject,
} from '@brain/moonloader';

import type { IGtaObjectFactory } from '../object';

export type ActorDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
};

export interface IGtaActor extends IActor {
  readonly handle: PedHandle;
}

export class GtaActor implements IGtaActor {
  readonly handle: PedHandle;
  private readonly objectFactory: IGtaObjectFactory;
  private readonly geometry: IGeometry;

  constructor(options: CreateActorOptions, deps: ActorDeps) {
    requestModel(options.modelId);
    loadAllModelsNow();

    const { x, y, z } = options.position;
    this.handle = createChar(4, options.modelId, x, y, z);
    dontRemoveChar(this.handle);
    markModelAsNoLongerNeeded(options.modelId);

    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
  }

  despawn(): void {
    if (doesCharExist(this.handle)) {
      deleteChar(this.handle);
    }
  }

  getPosition(): Vector3 {
    const [x, y, z] = getCharCoordinates(this.handle);

    return { x, y, z };
  }

  setPosition(position: Vector3): void {
    setCharCoordinates(this.handle, position.x, position.y, position.z);
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    return new Observable((subscriber: ISubscriber<Vector3>) => {
      /** Возвращает true, если actor прибыл в точку назначения */
      const tryArrive = (): boolean => {
        const current = this.getPosition();
        subscriber.next(current);
        const withinRadius = this.geometry.isWithinRadius2d(current, coords, completeRadius);

        if (withinRadius) {
          subscriber.complete();
        }

        return withinRadius;
      };

      const arrived = tryArrive();

      if (!arrived) {
        const target = this.objectFactory.create({
          modelId: 3283, // Id модели конуса
          position: coords,
        });

        target.freeze();
        target.setVisibility(false);
        target.setCollisionEnabled(false);

        subscriber.addTeardown(() => {
          target.remove();
          clearCharTasksImmediately(this.handle);
        });

        taskGoToObject(this.handle, target.handle, -1, completeRadius);
        const intervalId = setInterval(tryArrive, 1000);
        subscriber.addTeardown(() => clearInterval(intervalId));
      }
    });
  }
}
