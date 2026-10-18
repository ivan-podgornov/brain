import type { IObserver, IObserverObject } from './types';

export type NormalizedObserver<T> = Required<IObserverObject<T>>;

export type NormalizeObserverOptions = {
  onError(error?: unknown): void;
};

/** Приводит переданный observer к одному формату, когда observer является объектом со всеми методами */
export function normalizeObserver<T>(
  options: NormalizeObserverOptions,
  observer?: IObserver<T>
): NormalizedObserver<T> {
  // Нужно объявлять именно здесь, потому что функции next, error, complete могут добавиться
  // в EventTarget в качестве слушателей событий. Если noop будет одной и той же функцией для
  // нескольких наблюдателей, EventTarget дедуплицирует и добавить одиного слушателя для нескольких
  // наблюдателей, что неправильно.
  function noop() {}

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
