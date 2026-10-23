import type { IGeometry } from '@brain/geometry';

import type { IActorFactory } from './actor';
import type { IObjectFactory } from './object';

export interface IGame {
  readonly actorFactory: IActorFactory;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
}
