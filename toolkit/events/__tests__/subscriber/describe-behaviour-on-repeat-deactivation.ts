import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber';

import { createDeactivator, createMockedObserver, getDefaultConstructorOptions } from './helpers';
import type { DeactivateMethod } from './helpers';

function getOtherMethodRepeatBehaviourTitle(method: DeactivateMethod) {
  switch (method) {
    case 'complete':
      return 'При вызове после subscriber.complete()';
    case 'error':
      return 'При вызове после subscriber.error()';
    case 'signal.abort':
      return 'При вызове после перехода сигнала в состояние aborted';
  }
}

function getSameMethodRepeatBehaviourTitle(method: DeactivateMethod) {
  switch (method) {
    case 'complete':
      return 'При повторном вызове';
    case 'error':
      return 'При повторном вызове';
    case 'signal.abort':
      // Такого быть не должно при использовании AbortSignal, но могут передать другую реализацию
      return 'При повторном переходе сигнала в состояние aborted';
  }
}

function getRepeatBehaviourTitle(method: DeactivateMethod, same: boolean) {
  return same
    ? getSameMethodRepeatBehaviourTitle(method)
    : getOtherMethodRepeatBehaviourTitle(method);
}

/**
 * Возвращает кейсы, когда подписка деактивируется повторно после методов complete, error, signal.abort.
 * Если метод деактивации подписки совпадает с методом, который проверяем, то для него сгенерируется
 * сокращённый дескрипшен.
 * @param method - метод для которого нужно сгенерировать кейсы
 */
export function getRepeatBehaviourCases(method: DeactivateMethod) {
  return [
    {
      deactivate: createDeactivator('complete'),
      description: getRepeatBehaviourTitle('complete', method === 'complete'),
    },
    {
      deactivate: createDeactivator('error'),
      description: getRepeatBehaviourTitle('error', method === 'error'),
    },
    {
      deactivate: createDeactivator('signal.abort'),
      description: getRepeatBehaviourTitle('signal.abort', method === 'signal.abort'),
    },
  ];
}

export function describeBehaviorOnRepeatDeactivation(method: DeactivateMethod) {
  const repeatDeactivate = createDeactivator(method);

  describe.each(getRepeatBehaviourCases(method))(
    '$description, общее поведение',
    ({ deactivate }) => {
      it('Не выбрасывает ошибку', () => {
        const controller = new AbortController();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        deactivate(subscriber, controller);

        expect(() => repeatDeactivate(subscriber, controller)).not.toThrow();
      });

      it('Не вызывает зарегистрированные teardown-колбэки', () => {
        const controller = new AbortController();
        const teardown = vi.fn();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        subscriber.addTeardown(teardown);
        deactivate(subscriber, controller);
        repeatDeactivate(subscriber, controller);

        expect(teardown).toHaveBeenCalledOnce();
      });
    }
  );
}
