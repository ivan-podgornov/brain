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
    describe('Доставка значений', () => {
      it('Вызывает observer.next со значением, которое выдал subscriber', () => {
        const observer = createMockedObserver();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(observer.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если один наблюдатель подписан дважды, получает каждое значение дважды', () => {
        const observer = createMockedObserver();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(observer.next).toHaveBeenCalledTimes(2);
      });

      it('Если observer задан функцией, вызывает её со значением, которое выдал subscriber', () => {
        const observer = vi.fn();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(observer).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если subscriber выдал только значение, не вызывает observer.error и observer.complete', () => {
        const observer = createMockedObserver();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(observer.error).not.toHaveBeenCalled();
        expect(observer.complete).not.toHaveBeenCalled();
      });

      it('Вызывает обработчика ошибок каждого наблюдателя с ошибкой, которую выдал subscriber', () => {
        const error = new Error('subscriber failed');
        const firstObserver = createMockedObserver();
        const secondObserver = createMockedObserver();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(firstObserver, getDefaultSubscribeOptions());
        observable.subscribe(secondObserver, getDefaultSubscribeOptions());
        subscriber.error(error);

        expect(firstObserver.error).toHaveBeenCalledExactlyOnceWith(error);
        expect(secondObserver.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Вызывает обработчика успешного завершения подписки каждого наблюдателя, когда subscriber завершает вещание с помощью метода complete', () => {
        const firstObserver = createMockedObserver();
        const secondObserver = createMockedObserver();
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(firstObserver, getDefaultSubscribeOptions());
        observable.subscribe(secondObserver, getDefaultSubscribeOptions());
        subscriber.complete();

        expect(firstObserver.complete).toHaveBeenCalledExactlyOnceWith();
        expect(secondObserver.complete).toHaveBeenCalledExactlyOnceWith();
      });

      describe('При синхронном subscriber', () => {
        it('Если subscriber выдаёт значения синхронно в колбэке, они доходят до наблюдателя по порядку', () => {
          const observable = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.next(2);
          }, getDefaultObservableOptions());
          const observer = createMockedObserver();

          observable.subscribe(observer, getDefaultSubscribeOptions());

          expect(observer.next).toHaveBeenNthCalledWith(1, 1);
          expect(observer.next).toHaveBeenNthCalledWith(2, 2);
        });

        it('Если subscriber выдаёт значения, а затем синхронно завершается, значения доходят до наблюдателя', () => {
          const observable = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.complete();
          }, getDefaultObservableOptions());
          const observer = createMockedObserver();

          observable.subscribe(observer, getDefaultSubscribeOptions());

          expect(observer.next).toHaveBeenCalledExactlyOnceWith(1);
        });
      });
    });
  });
});
