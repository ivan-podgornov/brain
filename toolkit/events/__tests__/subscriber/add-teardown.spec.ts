import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber/subscriber';

import { createDeactivator, createMockedObserver, getDefaultConstructorOptions } from './helpers';

function getCasesAfterDeactivation() {
  return [
    {
      description: 'При вызове после вызова subscriber.complete',
      deactivate: createDeactivator('complete'),
    },
    {
      description: 'При вызове после вызова subscriber.error',
      deactivate: createDeactivator('error'),
    },
    {
      description:
        'При вызове после перехода сигнала, переданного в конструкторе, в состояние aborted',
      deactivate: createDeactivator('signal.abort'),
    },
  ];
}
describe('Subscriber', () => {
  describe('#addTeardown', () => {
    describe('При вызове на активном подписчике', () => {
      it('Не вызывает teardown-колбэк переданный в параметре', () => {
        const subscriber = new Subscriber(createMockedObserver(), getDefaultConstructorOptions());
        const teardown = vi.fn();

        subscriber.addTeardown(teardown);

        expect(teardown).not.toHaveBeenCalled();
      });
    });

    describe.each(getCasesAfterDeactivation())('$description', ({ deactivate }) => {
      it('Вызывает колбэк переданный в параметре немедленно', () => {
        const controller = new AbortController();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });
        const callbackAfter1 = vi.fn();
        const callbackAfter2 = vi.fn();

        deactivate(subscriber, controller);
        subscriber.addTeardown(callbackAfter1);
        subscriber.addTeardown(callbackAfter2);

        expect(callbackAfter1).toHaveBeenCalledBefore(callbackAfter2);
        expect(callbackAfter2).toHaveBeenCalled();
      });

      it('Не выбрасывает ошибку, если переданный колбэк выбросит ошибку', () => {
        const throwsErrorCallback = vi.fn().mockThrow(new Error());
        const controller = new AbortController();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        deactivate(subscriber, controller);

        expect(() => subscriber.addTeardown(throwsErrorCallback)).not.toThrow();
      });

      it('Если один из teardown-колбэков выбрасывает ошибку и в конструкторе Subscriber указан onError, onError вызывается с этой ошибкой', () => {
        const error = 'some error';
        const throwsErrorCallback = vi.fn().mockThrow(error);
        const constructorOnError = vi.fn();
        const controller = new AbortController();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
          onError: constructorOnError,
        });

        deactivate(subscriber, controller);
        subscriber.addTeardown(throwsErrorCallback);

        expect(constructorOnError).toHaveBeenCalledWith(error);
      });
    });
  });
});
