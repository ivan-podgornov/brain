import { AbortSignal } from '../abort-signal';
import type { IAbortSignal } from '../abort-signal';

import type { ISubscriber, IObserver, TeardownCallback } from './types';

export type SubscriberConstructorOptions = {
  signal?: IAbortSignal;
  onError?: (error?: unknown) => void;
};

export class Subscriber<T> implements ISubscriber<T> {
  readonly active: boolean;
  readonly signal: IAbortSignal;
  private readonly observer: IObserver<T>;
  private readonly options: SubscriberConstructorOptions;

  constructor(observer?: IObserver<T>, options: SubscriberConstructorOptions = {}) {
    this.active = false;
    this.observer = observer ?? (() => {});
    this.signal = AbortSignal.abort();
    this.options = options;
  }

  addTeardown(_callback: TeardownCallback): void {
    // to be continued
  }

  complete(): void {
    // to be continued
  }

  error(_error?: unknown): void {
    // to be continued
  }

  next(_value: T): void {
    // to be continued
  }
}
