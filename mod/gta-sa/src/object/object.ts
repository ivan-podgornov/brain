import type { CreateObjectOptions, IObject } from '@brain/game';
import type { Vector3 } from '@brain/geometry';
import type { ObjectHandle } from '@brain/moonloader';

import {
  createObjectNoOffset,
  freezeObjectPosition,
  deleteObject,
  doesObjectExist,
  getObjectCoordinates,
  loadAllModelsNow,
  markModelAsNoLongerNeeded,
  requestModel,
  setObjectCoordinates,
  setObjectCollision,
  setObjectVisible,
} from '@brain/moonloader';

export interface IGtaObject extends IObject {
  readonly handle: ObjectHandle;
}

export class GtaObject implements IGtaObject {
  readonly handle: ObjectHandle;

  constructor(options: CreateObjectOptions) {
    const { modelId, position } = options;

    requestModel(modelId);
    loadAllModelsNow();
    this.handle = createObjectNoOffset(modelId, position.x, position.y, position.z);
    markModelAsNoLongerNeeded(modelId);
  }

  remove(): void {
    if (doesObjectExist(this.handle)) {
      deleteObject(this.handle);
    }
  }

  freeze(): void {
    freezeObjectPosition(this.handle, true);
  }

  getPosition(): Vector3 {
    const [x, y, z] = getObjectCoordinates(this.handle);
    return { x, y, z };
  }

  setCollisionEnabled(enabled: boolean): void {
    setObjectCollision(this.handle, enabled);
  }

  setPosition(position: Vector3): void {
    setObjectCoordinates(this.handle, position.x, position.y, position.z);
  }

  setVisibility(visible: boolean): void {
    setObjectVisible(this.handle, visible);
  }
}
