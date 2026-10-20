import type { IObserver } from '../subscriber';

import type { ErrorHandler, Executor, ObservableOptions, SubscribeOptions } from './types';

export class Observable<T> {
  // @ts-expect-error -- заглушка, пока что не используется
  private readonly executor: Executor<T>;
  // @ts-expect-error -- заглушка, пока что не используется
  private readonly onError: ErrorHandler;

  constructor(executor: Executor<T>, options: ObservableOptions = {}) {
    this.executor = executor;
    this.onError = options.onError ?? (() => {});
  }

  subscribe(_observer?: IObserver<T>, _options: SubscribeOptions = {}) {}
}
