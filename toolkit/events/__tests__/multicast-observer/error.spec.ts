import { describe, expect, it, vi } from 'vitest';

import { MulticastObserver } from '../../src/multicast-observer';

import { describeBehaviourOnErrorInObserver } from './describe-behaviour-on-error-in-observer';
import { describeBehaviourWhenMethodAbsent } from './describe-behaviour-when-method-absent';
import { describeRecallObserver } from './describe-recall-observers';

import {
  createMockedObserver,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

describe('MulticastObserver', () => {
  describe('#error', () => {
    describeRecallObserver({ method: 'error' });
    describeBehaviourOnErrorInObserver({ method: 'error' });
    describeBehaviourWhenMethodAbsent({ method: 'error', observerAsFunction: false });
    describeBehaviourWhenMethodAbsent({ method: 'error', observerAsFunction: true });

    describe('При отсутствии error в наблюдателях - взаимодействие с onError в конструкторе', () => {
      it('Если один из добавленных наблюдателей является функцией и в конструкторе указан onError, то ошибка уходит в onError', () => {
        const error = new Error();
        const constructorOnError = vi.fn();
        const multicast = new MulticastObserver({
          ...getDefaultMulticastOptions(),
          onError: constructorOnError,
        });

        multicast.add(() => {}, getDefaultObserveOptions());
        multicast.error(error);

        expect(constructorOnError).toHaveBeenCalledWith(error);
      });

      it('Если добавлено несколько наблюдателей у которых не реализован обработчик ошибки и в конструкторе задан onError, onError вызывается для каждого такого наблюдателя', () => {
        const error = new Error();
        const constructorOnError = vi.fn();
        const multicast = new MulticastObserver({
          ...getDefaultMulticastOptions(),
          onError: constructorOnError,
        });

        multicast.add(() => {}, getDefaultObserveOptions());
        multicast.add(() => {}, getDefaultObserveOptions());
        multicast.error(error);

        expect(constructorOnError).toHaveBeenCalledTimes(2);
      });

      it('Если обработчик error наблюдателя отработал успешно и в конструкторе указан onError, то ошибка в onError не уходит', () => {
        const error = new Error();
        const constructorOnError = vi.fn();
        const multicast = new MulticastObserver({
          ...getDefaultMulticastOptions(),
          onError: constructorOnError,
        });

        multicast.add(createMockedObserver(), getDefaultObserveOptions());
        multicast.error(error);

        expect(constructorOnError).not.toHaveBeenCalled();
      });

      it('Если один из добавленных наблюдателей является функцией и если в конструкторе не указан onError, ошибка не выбрасывается', () => {
        const { onError, ...multicastOptionsWithoutOnError } = getDefaultMulticastOptions();
        const multicast = new MulticastObserver(multicastOptionsWithoutOnError);

        multicast.add(() => {}, getDefaultObserveOptions());

        expect(() => multicast.error(new Error('multicast error'))).not.toThrow();
      });

      it('Если один из добавленных наблюдателей указан как undefined и в конструкторе указан onError, то ошибка передаётся в onError', () => {
        const error = new Error();
        const constructorOnError = vi.fn();
        const multicast = new MulticastObserver({
          ...getDefaultMulticastOptions(),
          onError: constructorOnError,
        });

        multicast.add();
        multicast.error(error);

        expect(constructorOnError).toHaveBeenCalledWith(error);
      });

      it('Если один из добавленных наблюдателей указан как undefined и если в конструкторе не указан onError, ошибка не выбрасывается', () => {
        const { onError, ...multicastOptionsWithoutOnError } = getDefaultMulticastOptions();
        const multicast = new MulticastObserver(multicastOptionsWithoutOnError);

        multicast.add(undefined);

        expect(() => multicast.error(new Error('multicast error'))).not.toThrow();
      });
    });
  });
});
