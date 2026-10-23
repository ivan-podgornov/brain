import type { IGame } from '@brain/game';
import { Geometry } from '@brain/geometry';
import type { IGeometry } from '@brain/geometry';

import { GtaActorFactory } from './actor';
import type { IGtaActorFactory } from './actor';

import { GtaObjectFactory } from './object';
import type { IGtaObjectFactory } from './object';

export class GtaGame implements IGame {
  readonly actorFactory: IGtaActorFactory;
  readonly objectFactory: IGtaObjectFactory;
  readonly geometry: IGeometry;

  constructor() {
    this.geometry = new Geometry();
    this.objectFactory = new GtaObjectFactory();
    this.actorFactory = new GtaActorFactory({
      geometry: this.geometry,
      objectFactory: this.objectFactory,
    });
  }
}
