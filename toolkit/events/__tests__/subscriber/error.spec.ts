import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber/subscriber';

import { describeBehaviorOnDeactivation } from './describe-behavior-on-deactivation';
import {
  describeBehaviorOnRepeatDeactivation,
  getRepeatBehaviourCases,
} from './describe-behaviour-on-repeat-deactivation';
import { createMockedObserver, getDefaultConstructorOptions } from './helpers';

const casesWithoutErrorInObserver = [
  {
    description: 'Если observer задан в виде функции',
    createObserverWithoutError: () => vi.fn(),
  },
  {
    description: 'Если observer задан в виде объекта без метода error',
    createObserverWithoutError: () => {
      const { error, ...observer } = createMockedObserver();
      return observer;
    },
  },
  {
    description: 'Если observer не задан',
    createObserverWithoutError: () => undefined,
  },
] as const;

describe('Subscriber', () => {
  describe('#error', () => {
    it('Причиной перехода subscriber.signal в состояние aborted, является значение переданное в параметре метода', () => {
      const subscriber = new Subscriber(createMockedObserver(), getDefaultConstructorOptions());
      const error = 'some error';

      subscriber.error(error);

      expect(subscriber.signal.reason).toBe(error);
    });

    it('Не вызывает observer.complete', () => {
      const observer = createMockedObserver();
      const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
      const error = 'some error';

      subscriber.error(error);

      expect(observer.complete).not.toHaveBeenCalled();
    });

    describeBehaviorOnDeactivation('error');
    describeBehaviorOnRepeatDeactivation('error');

    describe('Если observer указан в виде объекта с методом error', () => {
      it('Вызывает observer.error с параметром переданным в subscriber.error', () => {
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
        const error = 'some error';

        subscriber.error(error);

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Вызывает добавленные с помощью addTeardown колбэки до вызова observer.error', () => {
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
        const callback = vi.fn();

        subscriber.addTeardown(callback);
        subscriber.error();

        expect(callback).toHaveBeenCalledBefore(observer.error);
      });

      it('Если один из teardown-колбэков выбрасывает ошибку, всё равно вызывает observer.error', () => {
        const throwsErrorCallback = vi.fn().mockThrow(new Error());
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        subscriber.addTeardown(throwsErrorCallback);
        subscriber.error();

        expect(observer.error).toHaveBeenCalled();
      });

      it('Если observer.error выбрасывает ошибку, она не выбрасывается из метода subscriber.error', () => {
        const throwsError = vi.fn().mockThrow(new Error());
        const observer = { ...createMockedObserver(), error: throwsError };
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        expect(() => subscriber.error()).not.toThrow();
      });

      it('Если observer.error выбрасывает ошибку и в конструкторе задан onError, вызывается onError с ошибкой которую выбросил observer.error', () => {
        const error = new Error();
        const throwsError = vi.fn().mockThrow(error);
        const constructorOnError = vi.fn();
        const observer = { ...createMockedObserver(), error: throwsError };
        const subscriber = new Subscriber(observer, {
          ...getDefaultConstructorOptions(),
          onError: constructorOnError,
        });

        subscriber.error();

        expect(constructorOnError).toHaveBeenCalledWith(error);
      });

      it('Если в конструкторе задан onError, не вызывает этот onError - ошибка обрабатывается в observer.error', () => {
        const constructorOnError = vi.fn();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          onError: constructorOnError,
        });

        subscriber.error();

        expect(constructorOnError).not.toHaveBeenCalled();
      });
    });

    describe('При отсутствии error в наблюдателе', () => {
      it.each(casesWithoutErrorInObserver)(
        '$description и onError не передан в конструктор, вызов subscriber.error не приводит к ошибке',
        ({ createObserverWithoutError }) => {
          const observer = createObserverWithoutError();
          const { onError, ...options } = getDefaultConstructorOptions(); // Убираем onError из options
          const subscriber = new Subscriber(observer, options);

          expect(() => subscriber.error()).not.toThrow();
        }
      );

      it.each(casesWithoutErrorInObserver)(
        '$description и onError передан в конструктор, вызывается onError с параметром переданным в subscriber.error',
        ({ createObserverWithoutError }) => {
          const observer = createObserverWithoutError();
          const onError = vi.fn();
          const error = 'some error';
          const subscriber = new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            onError,
          });

          subscriber.error(error);

          expect(onError).toHaveBeenCalledExactlyOnceWith(error);
        }
      );
    });

    describe.each(getRepeatBehaviourCases('error'))('$description', ({ deactivate }) => {
      it('Не вызывает observer.error', () => {
        const observer = createMockedObserver();
        const controller = new AbortController();
        const subscriber = new Subscriber(observer, {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        deactivate(subscriber, controller);
        observer.error.mockClear();
        subscriber.error();

        expect(observer.error).not.toHaveBeenCalled();
      });
    });
  });
});
