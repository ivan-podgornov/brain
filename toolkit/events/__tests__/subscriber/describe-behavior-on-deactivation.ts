import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber';

import { createDeactivator, createMockedObserver, getDefaultConstructorOptions } from './helpers';
import type { DeactivateMethod } from './helpers';

function getBehaviourTitle(method: DeactivateMethod) {
  switch (method) {
    case 'complete':
      return 'При вызове subscriber.complete()';
    case 'error':
      return 'При вызове subscriber.error()';
    case 'signal.abort':
      return 'При переходе сигнала переданного в конструктор в состояние aborted';
  }
}

export function describeBehaviorOnDeactivation(method: DeactivateMethod) {
  const deactivate = createDeactivator(method);

  describe(getBehaviourTitle(method), () => {
    it('Переводит subscriber.signal в состояние aborted', () => {
      const controller = new AbortController();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });

      deactivate(subscriber, controller);

      expect(subscriber.signal.aborted).toBe(true);
    });

    it('Деактивирует подписку - subscriber.active = false', () => {
      const controller = new AbortController();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });

      deactivate(subscriber, controller);

      expect(subscriber.active).toBe(false);
    });

    it('Вызывает зарегистрированные teardown-колбэки в порядке обратном регистрации', () => {
      const controller = new AbortController();
      const firstRegisteredTeardown = vi.fn();
      const secondRegisteredTeardown = vi.fn();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });

      subscriber.addTeardown(firstRegisteredTeardown);
      subscriber.addTeardown(secondRegisteredTeardown);
      deactivate(subscriber, controller);

      expect(firstRegisteredTeardown).toHaveBeenCalledAfter(secondRegisteredTeardown);
    });

    it('Если один и тот же teardown-колбэк, был добавлен несколько раз, то он вызывается столько раз, сколько был добавлен', () => {
      const controller = new AbortController();
      const teardown = vi.fn();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });

      subscriber.addTeardown(teardown);
      subscriber.addTeardown(teardown);
      deactivate(subscriber, controller);

      expect(teardown).toHaveBeenCalledTimes(2);
    });

    it('Если один из teardown-колбэков выбросил ошибку, остальные всё равно вызываются', () => {
      const controller = new AbortController();
      const throwsErrorTeardown = vi.fn().mockThrow('some error');
      const anotherTeardown = vi.fn();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });

      subscriber.addTeardown(anotherTeardown); // Порядок именно такой, потому что вызовется сначала throwsErrorTeardown, потом этот
      subscriber.addTeardown(throwsErrorTeardown);
      deactivate(subscriber, controller);

      expect(anotherTeardown).toHaveBeenCalled();
    });

    it('Если один из teardown-колбэков выбросил ошибку и в конструкторе Subscriber указан onError, onError вызывается с этой ошибкой', () => {
      const controller = new AbortController();
      const error = 'some error';
      const throwsErrorTeardown = vi.fn().mockThrow(error);
      const constructorOnError = vi.fn();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        onError: constructorOnError,
        signal: controller.signal,
      });

      subscriber.addTeardown(throwsErrorTeardown);
      deactivate(subscriber, controller);

      expect(constructorOnError).toHaveBeenCalledWith(error);
    });

    it('На момент вызова teardown-колбэков, подписчик уже находится в деактивированном состоянии - subscriber.active = false', () => {
      const controller = new AbortController();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });
      const teardown = vi.fn().mockImplementation(() => subscriber.active);

      subscriber.addTeardown(teardown);
      deactivate(subscriber, controller);

      expect(teardown).toHaveReturnedWith(false);
    });

    it('На момент вызова teardown-колбэков, сигнал подписчика уже находится в состоянии aborted - subscriber.signal.aborted = true', () => {
      const controller = new AbortController();
      const subscriber = new Subscriber(createMockedObserver(), {
        ...getDefaultConstructorOptions(),
        signal: controller.signal,
      });
      const teardown = vi.fn().mockImplementation(() => subscriber.signal.aborted);

      subscriber.addTeardown(teardown);
      deactivate(subscriber, controller);

      expect(teardown).toHaveReturnedWith(true);
    });
  });
}
