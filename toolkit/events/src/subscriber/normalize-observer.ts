import type { IObserver, IObserverObject } from './types';

export type NormalizedObserver<T> = Required<IObserverObject<T>>;

export type NormalizeObserverOptions = {
  onError(error?: unknown): void;
};

function noop() {}

/** Приводит переданный observer к одному формату, когда observer является объектом со всеми методами */
export function normalizeObserver<T>(
  options: NormalizeObserverOptions,
  observer?: IObserver<T>
): NormalizedObserver<T> {
  const defaultObserver: NormalizedObserver<T> = {
    next: noop,
    error: options.onError,
    complete: noop,
  };

  if (!observer) {
    return defaultObserver;
  }

  if (typeof observer === 'function') {
    return { ...defaultObserver, next: observer };
  }

  return {
    ...defaultObserver,
    next: typeof observer.next === 'function' ? observer.next.bind(observer) : defaultObserver.next,
    complete:
      typeof observer.complete === 'function'
        ? observer.complete.bind(observer)
        : defaultObserver.complete,
    error:
      typeof observer.error === 'function' ? observer.error.bind(observer) : defaultObserver.error,
  };
}
