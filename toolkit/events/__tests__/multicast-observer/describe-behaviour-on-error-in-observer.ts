import { describe, expect, it, vi } from 'vitest';

import { MulticastObserver } from '../../src/multicast-observer';

import {
  callMethod,
  createMockedObserver,
  createObserverWithThrowsMethod,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

import type { CreateMockedObserverOptions } from './helpers';

export function describeBehaviourOnErrorInObserver(options: CreateMockedObserverOptions) {
  const { method } = options;
  const methodName = options.observerAsFunction ? 'observer' : `observer.${method}`;

  describe(`При ошибке при вызове ${methodName}`, () => {
    it(`Вызывает обработчик ${method} остальных наблюдателей с параметрами, которые были переданы в multicastObserver.${method}`, () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const firstObserver = createMockedObserver();
      const secondObserver = createObserverWithThrowsMethod(options, new Error('observer error'));
      const thirdObserver = createMockedObserver();

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, getDefaultObserveOptions());
      multicast.add(thirdObserver, getDefaultObserveOptions());
      const params = callMethod(multicast, method);

      expect(firstObserver[method]).toHaveBeenCalledWith(...params);
      expect(thirdObserver[method]).toHaveBeenCalledWith(...params);
    });

    it(`Выброс ошибки из ${methodName}, не приводит к выбросу ошибки`, () => {
      const observer = createObserverWithThrowsMethod(options, new Error('observer error'));
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer);

      expect(() => callMethod(multicast, method)).not.toThrow();
    });

    it('Если в конструкторе не указан onError, то ошибка не выбрасывается', () => {
      const { onError, ...multicastOptionsWithoutOnError } = getDefaultMulticastOptions();
      const observer = createObserverWithThrowsMethod(options, new Error('observer error'));
      const multicast = new MulticastObserver(multicastOptionsWithoutOnError);

      multicast.add(observer);

      expect(() => callMethod(multicast, method)).not.toThrow();
    });

    it('Если в конструкторе указан onError, то ошибка передаётся в onError', () => {
      const error = new Error('observer error');
      const constructorOnError = vi.fn();
      const observer = createObserverWithThrowsMethod(options, error);
      const multicast = new MulticastObserver({
        ...getDefaultMulticastOptions(),
        onError: constructorOnError,
      });

      multicast.add(observer);
      callMethod(multicast, method);

      expect(constructorOnError).toHaveBeenCalledWith(error);
    });
  });
}
