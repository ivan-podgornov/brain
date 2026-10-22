import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../src';
import { AbortController } from '../../src/abort-controller';
import { AbortSignal } from '../../src/abort-signal';

import {
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from './helpers';

type Events = {
  update: [value: string];
  remove: [value: string];
};

describe('EventTarget', () => {
  describe('#when', () => {
    it('Возвращает observable, который сообщает о событиях с указанным именем каждый раз, когда они происходят в EventTarget', () => {
      const eventTarget = new EventTarget<Events>();
      const observable = eventTarget.when('update', getDefaultObservableOptions());
      const observer = createMockedObserver();

      observable.subscribe(observer, getDefaultSubscribeOptions());
      eventTarget.dispatchEvent('update', 'first-value');
      eventTarget.dispatchEvent('update', 'second-value');

      expect(observer.next).toHaveBeenCalledTimes(2);
    });

    it('Если у EventTarget происходит событие с другим именем, observable о нём не сообщает наблюдателям', () => {
      const eventTarget = new EventTarget<Events>();
      const observable = eventTarget.when('update', getDefaultObservableOptions());
      const observer = createMockedObserver();

      observable.subscribe(observer, getDefaultSubscribeOptions());
      eventTarget.dispatchEvent('remove', 'any value');

      expect(observer.next).not.toHaveBeenCalled();
    });

    it('Значения observable равны тем значениям, которые эмитит EventTarget', () => {
      const eventTarget = new EventTarget<Events>();
      const observable = eventTarget.when('update', getDefaultObservableOptions());
      const observer = createMockedObserver();

      observable.subscribe(observer, getDefaultSubscribeOptions());
      eventTarget.dispatchEvent('update', 'first-value');
      eventTarget.dispatchEvent('update', 'second-value');

      expect(observer.next).toHaveBeenNthCalledWith(1, 'first-value');
      expect(observer.next).toHaveBeenNthCalledWith(2, 'second-value');
    });

    it('Не снимает подписку, если сигнал переданный в параметрах subscribe, не переходит в состояние aborted', () => {
      const eventTarget = new EventTarget<Events>();
      const removeEventListenerSpy = vi.spyOn(eventTarget, 'removeEventListener');
      const observable = eventTarget.when('update', getDefaultObservableOptions());
      const controller = new AbortController();

      observable.subscribe(createMockedObserver(), {
        ...getDefaultSubscribeOptions(),
        signal: controller.signal,
      });

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it('Снимает подписку, когда сигнал переданный в параметрах subscribe, переходит в состояние aborted', () => {
      const eventTarget = new EventTarget<Events>();
      const removeEventListenerSpy = vi.spyOn(eventTarget, 'removeEventListener');
      const observable = eventTarget.when('update', getDefaultObservableOptions());
      const controller = new AbortController();

      observable.subscribe(createMockedObserver(), {
        ...getDefaultSubscribeOptions(),
        signal: controller.signal,
      });
      controller.abort();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('Моментально снимает подписку, если сигнал единственного наблюдателя изначально находится в состоянии aborted', () => {
      const eventTarget = new EventTarget<Events>();
      const removeEventListenerSpy = vi.spyOn(eventTarget, 'removeEventListener');
      const observable = eventTarget.when('update', getDefaultObservableOptions());

      observable.subscribe(createMockedObserver(), {
        ...getDefaultSubscribeOptions(),
        signal: AbortSignal.abort(),
      });

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('Если один из наблюдателей ещё активен и добавляется второй с сигналом в состоянии aborted, подписка не снимается', () => {
      const eventTarget = new EventTarget<Events>();
      const removeEventListenerSpy = vi.spyOn(eventTarget, 'removeEventListener');
      const observable = eventTarget.when('update', getDefaultObservableOptions());

      observable.subscribe(createMockedObserver());
      observable.subscribe(createMockedObserver(), {
        ...getDefaultSubscribeOptions(),
        signal: AbortSignal.abort(),
      });

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it('Если один из наблюдателей ещё активен и добавляется второй с сигналом в состоянии aborted, значения продолжают поступать активному наблюдателю', () => {
      const eventTarget = new EventTarget<Events>();
      const observable = eventTarget.when('update', getDefaultObservableOptions());
      const activeObserver = createMockedObserver();

      observable.subscribe(activeObserver);
      observable.subscribe(createMockedObserver(), {
        ...getDefaultSubscribeOptions(),
        signal: AbortSignal.abort(),
      });
      eventTarget.dispatchEvent('update', 'value');

      expect(activeObserver.next).toHaveBeenCalledExactlyOnceWith('value');
    });

    it('При ошибке в обработчиках наблюдателя, вызывает onError, переданный во втором параметре when', () => {
      const error = new Error('observer error');
      const eventTarget = new EventTarget<Events>();
      const onError = vi.fn();
      const observable = eventTarget.when('update', {
        ...getDefaultObservableOptions(),
        onError,
      });
      const observer = {
        ...createMockedObserver(),
        next: vi.fn().mockThrow(error),
      };

      observable.subscribe(observer);
      eventTarget.dispatchEvent('update', 'value');

      expect(onError).toHaveBeenCalledExactlyOnceWith(error);
    });
  });
});
