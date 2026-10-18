import { describe, expect, it, vi } from 'vitest';

import { MulticastObserver } from '../../src/multicast-observer';

import {
  createMockedObserver,
  createObserverWithThrowsMethod,
  getArgumentsForMethod,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

import type { CreateMockedObserverOptions } from './helpers';

export function describeBehaviourOnErrorInObserver(options: CreateMockedObserverOptions) {
  const { method } = options;
  const methodName = options.observerAsFunction ? 'observer' : `observer.${method}`;

  describe(`При ошибке при вызове ${methodName}`, () => {
    it(`Вызывает обработчик ${method} остальных наблюдателей с параметрами, которые были переданы в multicastObserver.${method}`, () => {
      const params = getArgumentsForMethod(method);
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const firstObserver = createMockedObserver();
      const secondObserver = createObserverWithThrowsMethod(options, new Error('observer error'));
      const thirdObserver = createMockedObserver();

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, getDefaultObserveOptions());
      multicast.add(thirdObserver, getDefaultObserveOptions());
      // A spread argument must either have a tuple type or be passed to a rest parameter.
      // @ts-expect-error -- Не понимаю что от меня здесь хочет typescript
      multicast[method](...params);

      expect(firstObserver[method]).toHaveBeenCalledWith(...params);
      expect(thirdObserver[method]).toHaveBeenCalledWith(...params);
    });

    it(`Выброс ошибки из ${methodName}, не приводит к выбросу ошибки`, () => {
      const observer = createObserverWithThrowsMethod(options, new Error('observer error'));
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer);

      expect(() => multicast[method]('any param')).not.toThrow();
    });

    it('Если в конструкторе не указан onError, то ошибка не выбрасывается', () => {
      const { onError, ...multicastOptionsWithoutOnError } = getDefaultMulticastOptions();
      const observer = createObserverWithThrowsMethod(options, new Error('observer error'));
      const multicast = new MulticastObserver(multicastOptionsWithoutOnError);

      multicast.add(observer);

      expect(() => multicast[method]('any param')).not.toThrow();
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
      multicast[method]('any param');

      expect(constructorOnError).toHaveBeenCalledWith(error);
    });
  });
}
