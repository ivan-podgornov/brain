import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('Взаимодействие с onError в конструкторе', () => {
      it('Если ошибок не было, не вызывается', () => {
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.next('value');
        subscriber.complete();

        expect(onError).not.toHaveBeenCalled();
      });

      it('Если teardown, добавленный в subscriber, выбрасывает ошибку, ошибка передаётся в onError переданный в конструкторе', () => {
        const error = new Error('teardown error');
        const onError = vi.fn();
        const { observable, subscriber } = createControlledObservable({
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.addTeardown(vi.fn().mockThrow(error));
        subscriber.complete();

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
