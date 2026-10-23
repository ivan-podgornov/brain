import type { CreateObjectOptions, IObjectFactory } from '@brain/game';

import { GtaObject } from './object';
import type { IGtaObject } from './object';

export interface IGtaObjectFactory extends IObjectFactory {
  create(options: CreateObjectOptions): IGtaObject;
}

export class GtaObjectFactory implements IGtaObjectFactory {
  create(options: CreateObjectOptions): IGtaObject {
    return new GtaObject(options);
  }
}
