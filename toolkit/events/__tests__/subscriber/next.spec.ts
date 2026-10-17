import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber';
import type { IObserver, IObserverFunction } from '../../src/subscriber';

import { createDeactivator, createMockedObserver, getDefaultConstructorOptions } from './helpers';

function getCasesAfterDeactivation() {
  return [
    {
      description: 'При вызове после subscriber.complete',
      deactivate: createDeactivator('complete'),
    },
    {
      description: 'При вызове после subscriber.error',
      deactivate: createDeactivator('error'),
    },
    {
      description:
        'При вызове после того как сигнал переданный в конструкторе перейдёт в состояние aborted',
      deactivate: createDeactivator('signal.abort'),
    },
  ];
}

function getCasesWithObserverNext() {
  return [
    {
      description: 'Если observer задан в виде объекта с методом next',
      nextName: 'observer.next',
      createObserver: (next: IObserverFunction<unknown>) => {
        const observer = createMockedObserver() satisfies IObserver<unknown>;

        return { ...observer, next };
      },
    },
    {
      description: 'Если observer задан как функция',
      nextName: 'observer',
      createObserver: (next: IObserverFunction<unknown>) => next,
    },
  ];
}

function getCasesWithoutObserverNext() {
  return [
    {
      description: 'Если observer задан в виде объекта без метода next',
      createObserver: () => {
        const { next, ...observer } = createMockedObserver();
        return observer;
      },
    },
    {
      description: 'Observer не задан',
      createObserver: () => undefined,
    },
  ];
}

describe('Subscriber', () => {
  describe('#next', () => {
    describe('При заданном колбэке next', () => {
      it.each(getCasesWithObserverNext())(
        '$description, вызывает $nextName с тем же параметром, с которым вызван subscriber.next',
        ({ createObserver }) => {
          const next = vi.fn();
          const observer = createObserver(next);
          const value = 1;
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next(value);

          expect(next).toHaveBeenCalledExactlyOnceWith(value);
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description, вызывает $nextName один раз на каждый вызов метода',
        ({ createObserver }) => {
          const next = vi.fn();
          const observer = createObserver(next);
          const firstValue = 'first value';
          const secondValue = 'second value';
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next(firstValue);
          subscriber.next(secondValue);

          expect(next).toHaveBeenCalledTimes(2);
          expect(next).toHaveBeenNthCalledWith(1, 'first value');
          expect(next).toHaveBeenNthCalledWith(2, 'second value');
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description и $nextName выбрасывает ошибку - это не приводит к ошибке при вызове subscriber.next',
        ({ createObserver }) => {
          const next = vi.fn().mockThrow('some error');
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          expect(() => subscriber.next('some value')).not.toThrow();
        }
      );

      it('Если observer задан в виде объекта с методами next и error, ошибка в observer.next не приводит к вызову observer.error', () => {
        const observer = {
          ...createMockedObserver(),
          next: vi.fn().mockThrow('some error'),
        };
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        subscriber.next('any value');

        expect(observer.error).not.toHaveBeenCalled();
      });

      it.each(getCasesWithObserverNext())(
        '$description и $nextName выбрасывает ошибку, подписка продолжает находиться в активном состоянии',
        ({ createObserver }) => {
          const next = vi.fn().mockThrow('some error');
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next('any value');

          expect(subscriber.active).toBe(true);
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description и $nextName выбрасывает ошибку, сигнал подписки продолжает находиться в pending состоянии',
        ({ createObserver }) => {
          const next = vi.fn().mockThrow('some error');
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next('any value');

          expect(subscriber.signal.aborted).toBe(false);
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description, $nextName выбрасывает ошибку и в конструкторе задан onError, вызывается onError с ошибкой которую выбросил $nextName',
        ({ createObserver }) => {
          const error = 'some error';
          const next = vi.fn().mockThrow(error);
          const constructorOnError = vi.fn();
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            onError: constructorOnError,
          });

          subscriber.next('some value');

          expect(constructorOnError).toHaveBeenCalledWith(error);
        }
      );
    });

    describe('При отсутствии колбэка next в обсервере', () => {
      it.each(getCasesWithoutObserverNext())(
        '$description, вызов метода subscriber.next не приводит к ошибке',
        ({ createObserver }) => {
          const observer = createObserver();
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          expect(() => subscriber.next('some value')).not.toThrow();
        }
      );
    });

    describe.each(getCasesAfterDeactivation())('$description', ({ deactivate }) => {
      it.each(getCasesWithObserverNext())(
        '$description, вызов subscriber.next() не выбрасывает ошибку',
        ({ createObserver }) => {
          const controller = new AbortController();
          const observer = createObserver(() => {});
          const subscriber = new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            signal: controller.signal,
          });

          deactivate(subscriber, controller);

          expect(() => subscriber.next('any value')).not.toThrow();
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description, вызов subscriber.next() не вызывает $nextName',
        ({ createObserver }) => {
          const controller = new AbortController();
          const next = vi.fn();
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            signal: controller.signal,
          });

          deactivate(subscriber, controller);
          subscriber.next('any value');

          expect(next).not.toHaveBeenCalled();
        }
      );
    });
  });
});
