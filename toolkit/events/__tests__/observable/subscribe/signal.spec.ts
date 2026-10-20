import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../../src/abort-controller';
import { AbortSignal } from '../../../src/abort-signal';
import { Observable } from '../../../src/observable';
import type { ISubscriber } from '../../../src/subscriber';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При переданном сигнале', () => {
      // В этих тестах нужен второй подписчик без сигнала, который держит подписку активной.
      // Иначе значения перестали бы приходить из-за закрытия подписки, а не из-за отписки наблюдателя

      it('Если сигнал наблюдателя переходит в состояние aborted, наблюдатель перестаёт получать значения', () => {
        const controller = new AbortController();
        const { observable, subscriber } = createControlledObservable();
        const observer = createMockedObserver();

        observable.subscribe(createMockedObserver());
        observable.subscribe(observer, {
          ...getDefaultSubscribeOptions(),
          signal: controller.signal,
        });
        controller.abort();
        subscriber.next('value');

        expect(observer.next).not.toHaveBeenCalled();
      });

      it('Если сигнал одного из наблюдателей переходит в состояние aborted, остальные наблюдатели продолжают получать значения', () => {
        const controller = new AbortController();
        const { observable, subscriber } = createControlledObservable();
        const otherObserver = createMockedObserver();

        observable.subscribe(otherObserver, getDefaultSubscribeOptions());
        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: controller.signal,
        });
        controller.abort();
        subscriber.next('value');

        expect(otherObserver.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если сигналы всех наблюдателей перешли в состояние aborted, сигнал subscriber переходит в состояние aborted', () => {
        const controller = new AbortController();
        const { observable, subscriber } = createControlledObservable();
        const observer = createMockedObserver();

        observable.subscribe(observer, {
          ...getDefaultSubscribeOptions(),
          signal: controller.signal,
        });
        controller.abort();

        expect(subscriber.signal.aborted).toBe(true);
      });

      it('Если сигналы всех наблюдателей перешли в состояние aborted, причиной перехода сигнала subscriber в состояние aborted, становится причина сигнала последнего перешедшего в это состояние наблюдателя', () => {
        const firstController = new AbortController();
        const secondController = new AbortController();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: firstController.signal,
        });
        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: secondController.signal,
        });
        secondController.abort('second observer aborted');
        firstController.abort('first observer aborted');

        expect(subscriber.signal.reason).toBe('first observer aborted');
      });

      it('Если сигналы всех наблюдателей перешли в состояние aborted, вызывает teardown', () => {
        const firstController = new AbortController();
        const secondController = new AbortController();
        const { observable, subscriber } = createControlledObservable();
        const teardown = vi.fn();

        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: firstController.signal,
        });
        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: secondController.signal,
        });
        subscriber.addTeardown(teardown);
        secondController.abort();
        firstController.abort();

        expect(teardown).toHaveBeenCalledOnce();
      });
    });

    describe('При первом подключении с сигналом который уже в состоянии aborted', () => {
      it('Всё равно вызывает callback-executor', () => {
        const executor = vi.fn();
        const observable = new Observable(executor, getDefaultObservableOptions());

        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: AbortSignal.abort(),
        });

        expect(executor).toHaveBeenCalled();
      });

      it('Subscriber, переданный в колбэк-executor, неактивен', () => {
        const executor = vi
          .fn()
          .mockImplementation((subscriber: ISubscriber<unknown>) => subscriber.active);
        const observable = new Observable(executor, getDefaultObservableOptions());

        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: AbortSignal.abort(),
        });

        expect(executor).toHaveReturnedWith(false);
      });

      it('Наблюдатель не получает значения', () => {
        const { observable, subscriber } = createControlledObservable();
        const observer = createMockedObserver();

        observable.subscribe(observer, { signal: AbortSignal.abort() });
        subscriber.next('value');

        expect(observer.next).not.toHaveBeenCalled();
      });
    });
  });
});
