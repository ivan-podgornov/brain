import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При ошибке которую отправляет subscriber.error', () => {
      it('Если наблюдатель не имеет обработчика ошибок, onError переданный в конструкторе, вызывается с параметром, с которым вызывался subscriber.error', () => {
        const error = new Error('subscriber failed');
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        subscriber.error(error);

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('onError переданный в конструкторе, вызывается по разу на каждого наблюдателя без обработчика ошибок', () => {
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        subscriber.error(new Error('Subscriber failed'));

        expect(onError).toHaveBeenCalledTimes(2);
      });

      it('Если у наблюдателя есть обработчик ошибок, onError переданный в конструкторе, не вызывается', () => {
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.error(new Error('subscriber failed'));

        expect(onError).not.toHaveBeenCalled();
      });
    });
  });
});
