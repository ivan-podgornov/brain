import type { CreateActorOptions, IActorFactory } from '@brain/game';
import type { IGeometry } from '@brain/geometry';

import type { IGtaObjectFactory } from '../object';

import { GtaActor } from './actor';
import type { ActorDeps, IGtaActor } from './actor';

export type ActorFactoryDeps = ActorDeps;

export interface IGtaActorFactory extends IActorFactory {
  create(options: CreateActorOptions): IGtaActor;
}

export class GtaActorFactory implements IGtaActorFactory {
  private readonly geometry: IGeometry;
  private readonly objectFactory: IGtaObjectFactory;

  constructor(deps: ActorFactoryDeps) {
    this.geometry = deps.geometry;
    this.objectFactory = deps.objectFactory;
  }

  create(options: CreateActorOptions): IGtaActor {
    return new GtaActor(options, {
      geometry: this.geometry,
      objectFactory: this.objectFactory,
    });
  }
}
