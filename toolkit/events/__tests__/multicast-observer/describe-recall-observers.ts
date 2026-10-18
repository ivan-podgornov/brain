import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { AbortSignal } from '../../src/abort-signal';
import { MulticastObserver } from '../../src/multicast-observer';

import type { CreateMockedObserverOptions } from './helpers';

import {
  callMethod,
  createMockedObserver,
  createObserverWithMethod,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

// Методы, после вызова которых вещание завершается и наблюдатели больше ничего не получают
const FINISH_METHODS = ['complete', 'error'] as const;

function getTitle(options: CreateMockedObserverOptions) {
  if (options.method === 'next' && options.observerAsFunction) {
    return 'При наблюдателе, заданном в виде функции';
  }

  return `При наблюдателе заданном в виде объекта с методом ${options.method}`;
}

export function describeRecallObserver(options: CreateMockedObserverOptions) {
  const { method } = options;
  const methodName = options.observerAsFunction ? 'observer' : `observer.${method}`;

  describe(getTitle(options), () => {
    it(`Вызывает обработчик ${method} каждого добавленного наблюдателя`, () => {
      const firstImplementation = vi.fn();
      const firstObserver = createObserverWithMethod(options, firstImplementation);
      const secondImplementation = vi.fn();
      const secondObserver = createObserverWithMethod(options, secondImplementation);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, getDefaultObserveOptions());
      callMethod(multicast, method);

      expect(firstImplementation).toHaveBeenCalled();
      expect(secondImplementation).toHaveBeenCalled();
    });

    it(`Вызывает обработчики ${method} каждого добавленного наблюдателя в порядке их добавления`, () => {
      const firstImplementation = vi.fn();
      const firstObserver = createObserverWithMethod(options, firstImplementation);
      const secondImplementation = vi.fn();
      const secondObserver = createObserverWithMethod(options, secondImplementation);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, getDefaultObserveOptions());
      callMethod(multicast, method);

      expect(firstImplementation).toHaveBeenCalledBefore(secondImplementation);
    });

    it(`Вызывает ${methodName} с параметром переданным в multicastObserver.${method}`, () => {
      const methodImplementation = vi.fn();
      const observer = createObserverWithMethod(options, methodImplementation);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer, getDefaultObserveOptions());
      const params = callMethod(multicast, method);

      expect(methodImplementation).toHaveBeenCalledExactlyOnceWith(...params);
    });

    it(`Если сигнал наблюдателя перешел в состояние aborted, продолжает вызывать обработчик ${method} остальных наблюдателей`, () => {
      const abortController = new AbortController();
      const observerThatWillBeAborted = createObserverWithMethod(options, () => {});
      const observer = createMockedObserver();
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer, getDefaultObserveOptions());
      multicast.add(observerThatWillBeAborted, {
        ...getDefaultObserveOptions(),
        signal: abortController.signal,
      });
      abortController.abort();
      callMethod(multicast, method);

      expect(observer[method]).toHaveBeenCalled();
    });

    it(`Если добавить наблюдателя несколько раз с разными сигналами, при переходе одного из сигналов в aborted, продолжит вызывать ${methodName} остальных наблюдателей`, () => {
      const firstAbortController = new AbortController();
      const secondAbortController = new AbortController();
      const implementation = vi.fn();
      const observer = createObserverWithMethod(options, implementation);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: firstAbortController.signal,
      });
      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: secondAbortController.signal,
      });

      firstAbortController.abort();
      callMethod(multicast, method);

      expect(implementation).toHaveBeenCalledOnce();
    });

    it(`После того как сигнал наблюдателя, переданного во втором параметре, перешел в состояние aborted, ${methodName} не вызывается`, () => {
      const controller = new AbortController();
      const methodImplementation = vi.fn();
      const observer = createObserverWithMethod(options, methodImplementation);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      // Нужен второй наблюдатель, который будет держать сигнал MulticastObserver в состоянии pending,
      // А то если он перейдёт в состояние aborted, метод не будет вызываться по этой причине,
      // а не потому что конкретный наблюдатель перешел в состояние aborted
      multicast.add(createMockedObserver(), getDefaultObserveOptions());
      multicast.add(observer, { ...getDefaultObserveOptions(), signal: controller.signal });
      const params = callMethod(multicast, method);
      controller.abort();
      callMethod(multicast, method);

      expect(methodImplementation).toHaveBeenCalledExactlyOnceWith(...params);
    });

    it(`Если сигнал наблюдателя изначально в состоянии aborted, ${methodName} не вызывается`, () => {
      const methodImplementation = vi.fn();
      const observer = createObserverWithMethod(options, methodImplementation);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      // Нужен второй наблюдатель, который будет держать сигнал MulticastObserver в состоянии pending,
      // А то если он перейдёт в состояние aborted, метод не будет вызываться по этой причине,
      // а не потому что конкретный наблюдатель перешел в состояние aborted
      multicast.add(createMockedObserver(), getDefaultObserveOptions());
      multicast.add(observer, { ...getDefaultObserveOptions(), signal: AbortSignal.abort() });
      callMethod(multicast, method);

      expect(methodImplementation).not.toHaveBeenCalled();
    });

    describe.each(FINISH_METHODS)('При вызове после %s', (finishMethod) => {
      it(`${methodName} не вызывается`, () => {
        const methodImplementation = vi.fn();
        const observer = createObserverWithMethod(options, methodImplementation);
        const multicast = new MulticastObserver(getDefaultMulticastOptions());

        multicast.add(observer, getDefaultObserveOptions());
        callMethod(multicast, finishMethod);
        // Если finishMethod совпадает с method, то наблюдатель уже был вызван при завершении
        methodImplementation.mockClear();
        callMethod(multicast, method);

        expect(methodImplementation).not.toHaveBeenCalled();
      });
    });
  });
}
