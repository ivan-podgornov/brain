import { vi } from 'vitest';

import type { MulticastOptions } from '../../src/multicast-observer';
import type { IObserver, IObserverObject, ObserveOptions } from '../../src/subscriber';

export function createMockedObserver() {
  return {
    next: vi.fn(),
    complete: vi.fn(),
    error: vi.fn(),
  } satisfies IObserver<unknown>;
}

export function getDefaultObserveOptions(): ObserveOptions {
  return {};
}

export function getDefaultMulticastOptions(): MulticastOptions {
  return {};
}

type Method = 'complete' | 'error' | 'next';
type MethodImplementation<M extends Method = Method> = Required<IObserverObject<unknown>>[M];

export type CreateMockedObserverOptions<M extends Method = Method> = {
  /** Метод который нужно протестировать */
  method: M;
  /**
   * Если true, то observer передаётся в виде функции
   * @default {false}
   */
  observerAsFunction?: boolean;
};

export function createObserverWithMethod<M extends Method>(
  options: CreateMockedObserverOptions<M>,
  implementation: MethodImplementation<M>
) {
  if (options.method === 'next' && options.observerAsFunction) {
    return implementation;
  }

  if (options.observerAsFunction) {
    throw new Error(`Нельзя сделать observer с методом ${options.method} в виде функции`);
  }

  return {
    ...createMockedObserver(),
    [options.method]: implementation,
  };
}

export function getArgumentsForMethod<M extends Method>(method: M) {
  if (method === 'complete') {
    return [] as const;
  }

  return ['any value'] as const;
}

/**
 * Создаёт наблюдателя в котором указанный метод выбрасывает ошибку.
 * Если параметр observerAsFunction true, создаёт наблюдателя-функцию, которая выбрасывает ошибку
 */
export function createObserverWithThrowsMethod(
  options: CreateMockedObserverOptions<Method>,
  error: unknown
) {
  const implementation = vi.fn().mockThrow(error);

  if (options.method === 'next' && options.observerAsFunction) {
    return implementation;
  }

  return {
    ...createMockedObserver(),
    [options.method]: implementation,
  };
}

/**
 * Создаёт наблюдателя в котором отсутствует указанный метод.
 * Если параметр observerAsFunction true и нужно сделать наблюдатель с отсутствующим next, вернёт undefined.
 * В остальных случаях если observerAsFunction true, вернёт просто функцию-наблюдатель.
 * Если observerAsFunction false, вернёт объект наблюдатель без указанного метода
 */
export function createObserverWithAbsentMethod(options: CreateMockedObserverOptions<Method>) {
  if (options.method === 'next' && options.observerAsFunction) {
    return;
  }

  if (options.observerAsFunction) {
    return vi.fn();
  }

  const observer = createMockedObserver();
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- здесь это оправдано, так как иначе проблематичнее было бы создать нужного наблюдателя
  delete observer[options.method];

  return observer;
}
