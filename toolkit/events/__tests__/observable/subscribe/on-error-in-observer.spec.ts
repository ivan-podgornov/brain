import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При ошибке в обработчиках наблюдателя', () => {
      it('Если в observer.next происходит ошибка, вызывает onError переданный в конструкторе с этой ошибкой', () => {
        const error = new Error('next failed');
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });
        const observer = { ...createMockedObserver(), next: vi.fn().mockThrow(error) };

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если в одном из observer.next происходит ошибка, остальные наблюдатели всё равно продолжают получать событие', () => {
        const error = new Error('next failed');
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });
        const failedObserver = { ...createMockedObserver(), next: vi.fn().mockThrow(error) };
        const otherObserver = createMockedObserver();

        observable.subscribe(failedObserver, getDefaultSubscribeOptions());
        observable.subscribe(otherObserver, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(otherObserver.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если в observer.error происходит ошибка, вызывает onError переданный в конструкторе с этой ошибкой', () => {
        const error = new Error('error failed');
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });
        const observer = { ...createMockedObserver(), error: vi.fn().mockThrow(error) };

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.error('other error');

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если в observer.complete происходит ошибка, вызывает onError переданный в конструкторе с этой ошибкой', () => {
        const error = new Error('complete failed');
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });
        const observer = { ...createMockedObserver(), complete: vi.fn().mockThrow(error) };

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.complete();

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
