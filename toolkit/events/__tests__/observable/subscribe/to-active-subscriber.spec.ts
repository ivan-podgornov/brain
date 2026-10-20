import { describe, expect, it, vi } from 'vitest';

import { Observable } from '../../../src/observable';

import {
  createMockedObserver,
  createControlledObservable,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При подписке к observable, subscriber которого активен', () => {
      it('Не вызывает callback-executor повторно', () => {
        const executor = vi.fn();
        const observable = new Observable(executor, getDefaultObservableOptions());
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(executor).toHaveBeenCalledOnce();
      });

      it('Все наблюдатели получают значение, которое выдал subscriber', () => {
        const { observable, subscriber } = createControlledObservable();
        const firstObserver = createMockedObserver();
        const secondObserver = createMockedObserver();

        observable.subscribe(firstObserver, getDefaultSubscribeOptions());
        observable.subscribe(secondObserver, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(firstObserver.next).toHaveBeenCalledExactlyOnceWith('value');
        expect(secondObserver.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Присоединившийся наблюдатель не получает значения, выданные до его подписки', () => {
        const { observable, subscriber } = createControlledObservable();
        const lateObserver = createMockedObserver();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.next('missed value');
        observable.subscribe(lateObserver, getDefaultSubscribeOptions());

        expect(lateObserver.next).not.toHaveBeenCalled();
      });

      it('Присоединившийся наблюдатель получает значения, выданные после его подписки', () => {
        const { observable, subscriber } = createControlledObservable();
        const lateObserver = createMockedObserver();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        observable.subscribe(lateObserver, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(lateObserver.next).toHaveBeenCalledExactlyOnceWith('value');
      });
    });
  });
});
