import { describe, expect, it } from 'vitest';

import { MulticastObserver } from '../../src/multicast-observer';

import {
  createMockedObserver,
  createObserverWithAbsentMethod,
  getDefaultObserveOptions,
  getDefaultMulticastOptions,
} from './helpers';

import type { CreateMockedObserverOptions } from './helpers';

export function describeBehaviourWhenMethodAbsent(options: CreateMockedObserverOptions) {
  const { method } = options;
  const titleSuffix = options.observerAsFunction
    ? 'если наблюдатель задан в виде функции'
    : 'если наблюдатель задан в виде объекта';

  describe(`При отсутствии ${method} в одном из наблюдателей, ${titleSuffix}`, () => {
    it(`Вызов multicastObserver.${method} не приводит к выбросу ошибки`, () => {
      const observer = createObserverWithAbsentMethod(options);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer, getDefaultObserveOptions());

      expect(() => multicast[method]('any param')).not.toThrow();
    });

    it(`Вызываются обработчики ${method} остальных наблюдателей`, () => {
      const firstObserver = createMockedObserver();
      const secondObserver = createObserverWithAbsentMethod(options);
      const thirdObserver = createMockedObserver();
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, getDefaultObserveOptions());
      multicast.add(thirdObserver, getDefaultObserveOptions());
      multicast[method]('any value');

      expect(firstObserver[method]).toHaveBeenCalled();
      expect(thirdObserver[method]).toHaveBeenCalled();
    });
  });
}
