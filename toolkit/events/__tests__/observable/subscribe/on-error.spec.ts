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

      describe('При вызове subscriber.error', () => {
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

      describe('При ошибке в наблюдателе', () => {
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
});
