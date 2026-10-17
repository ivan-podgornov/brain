import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber/subscriber';

import { describeBehaviorOnDeactivation } from './describe-behavior-on-deactivation';
import {
  describeBehaviorOnRepeatDeactivation,
  getRepeatBehaviourCases,
} from './describe-behaviour-on-repeat-deactivation';
import { createMockedObserver, getDefaultConstructorOptions } from './helpers';

const casesWithoutCompleteInObserver = [
  {
    description: 'Если observer задан в виде функции',
    createObserverWithoutComplete: () => vi.fn(),
  },
  {
    description: 'Если observer задан в виде объекта без метода complete',
    createObserverWithoutComplete: () => {
      const { complete, ...observer } = createMockedObserver();
      return observer;
    },
  },
  {
    description: 'Если observer не задан',
    createObserverWithoutComplete: () => undefined,
  },
] as const;

describe('Subscriber', () => {
  describe('#complete', () => {
    describeBehaviorOnDeactivation('complete');
    describeBehaviorOnRepeatDeactivation('complete');

    describe('Если observer указан в виде объекта с методом complete', () => {
      it('Вызывает observer.complete', () => {
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        subscriber.complete();

        expect(observer.complete).toHaveBeenCalledOnce();
      });

      it('Вызывает добавленные с помощью addTeardown колбэки до вызова observer.complete', () => {
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
        const teardown = vi.fn();

        subscriber.addTeardown(teardown);
        subscriber.complete();

        expect(teardown).toHaveBeenCalledBefore(observer.complete);
      });

      it('Если один из teardown-колбэков выбрасывает ошибку, всё равно вызывает observer.complete', () => {
        const throwsErrorTeardown = vi.fn().mockThrow(new Error());
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        subscriber.addTeardown(throwsErrorTeardown);
        subscriber.complete();

        expect(observer.complete).toHaveBeenCalled();
      });

      it('Если observer.complete выбрасывает ошибку, она не выбрасывается из метода subscriber.complete', () => {
        const throwsErrorComplete = vi.fn().mockThrow(new Error());
        const observer = { ...createMockedObserver(), complete: throwsErrorComplete };
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        expect(() => subscriber.complete()).not.toThrow();
      });

      it('Если observer.complete выбрасывает ошибку и в конструкторе задан onError, вызывается onError с ошибкой которую выбросил observer.complete', () => {
        const error = new Error();
        const throwsErrorComplete = vi.fn().mockThrow(error);
        const constructorOnError = vi.fn();
        const observer = { ...createMockedObserver(), complete: throwsErrorComplete };
        const subscriber = new Subscriber(observer, {
          ...getDefaultConstructorOptions(),
          onError: constructorOnError,
        });

        subscriber.complete();

        expect(constructorOnError).toHaveBeenCalledWith(error);
      });
    });

    describe('При отсутствии complete в наблюдателе', () => {
      it.each(casesWithoutCompleteInObserver)(
        '$description, вызов subscriber.complete не приводит к ошибке',
        ({ createObserverWithoutComplete }) => {
          // Создаёт один из вариантов observer, главное что в нём нет колбэка complete
          const observer = createObserverWithoutComplete();
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          expect(() => subscriber.complete()).not.toThrow();
        }
      );
    });

    describe.each(getRepeatBehaviourCases('complete'))('$description', ({ deactivate }) => {
      it('Не вызывает observer.complete', () => {
        const observer = createMockedObserver();
        const controller = new AbortController();
        const subscriber = new Subscriber(observer, {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        deactivate(subscriber, controller);
        observer.complete.mockClear();
        subscriber.complete();

        expect(observer.complete).not.toHaveBeenCalled();
      });

      // Кейс добавлен, потому что при определённой жизненной ситуации, может возникнуть желание
      // вызвать observer.error при повторном вызове complete
      it('Не вызывает observer.error', () => {
        const observer = createMockedObserver();
        const controller = new AbortController();
        const subscriber = new Subscriber(observer, {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        deactivate(subscriber, controller);
        observer.error.mockClear();
        subscriber.complete();

        expect(observer.error).not.toHaveBeenCalled();
      });
    });
  });
});
