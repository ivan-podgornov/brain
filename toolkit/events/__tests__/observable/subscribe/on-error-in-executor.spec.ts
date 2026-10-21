import { describe, expect, it, vi } from 'vitest';

import { Observable } from '../../../src/observable';

import {
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При ошибке в колбэк-executor', () => {
      it('Если наблюдатель не имеет обработчика ошибок, onError переданный в конструкторе, вызывается с ошибкой, которую выбросил executor', () => {
        const error = new Error('executor failed');
        const onError = vi.fn();
        const executor = vi.fn().mockThrow(error);
        const observable = new Observable(executor, {
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('onError переданный в конструкторе, вызывается по разу на каждого наблюдателя без обработчика ошибок', () => {
        const error = new Error('executor failed');
        const onError = vi.fn();
        const executor = vi.fn().mockThrow(error);
        const observable = new Observable(executor, {
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());

        expect(onError).toHaveBeenCalledTimes(2);
      });

      it('Если у наблюдателя есть обработчик ошибок, onError переданный в конструкторе, не вызывается', () => {
        const error = new Error('executor failed');
        const onError = vi.fn();
        const executor = vi.fn().mockThrow(error);
        const observable = new Observable(executor, {
          ...getDefaultObservableOptions(),
          onError,
        });

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());

        expect(onError).not.toHaveBeenCalled();
      });
    });
  });
});
