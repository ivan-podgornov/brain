import { MulticastObserver } from '../multicast-observer';
import { Subscriber } from '../subscriber';
import type { IObserver, ISubscriber, SubscriberConstructorOptions } from '../subscriber';

import type { ErrorHandler, Executor, ObservableOptions, SubscribeOptions } from './types';

export class Observable<T> {
  private readonly executor: Executor<T>;
  private readonly onError: ErrorHandler;
  private multicast: MulticastObserver<T> | null;
  private subscriber: ISubscriber<T> | null;

  /**
   * Первым параметром принимает функцию, которая вызывается при подписке первого наблюдателя.
   * Функция принимает подписчика и может сгенерировать новые значения в этом подписчике.
   */
  constructor(executor: Executor<T>, options: ObservableOptions = {}) {
    this.executor = executor;
    this.onError = options.onError ?? (() => {});
    this.multicast = null;
    this.subscriber = null;
  }

  /**
   * Подписывает наблюдателя к подписке. Если в options указано поле signal, наблюдатель будет
   * отписан, когда подписка перейдёт в состояние aborted.
   */
  subscribe(observer?: IObserver<T>, options: SubscribeOptions = {}): void {
    const multicast = this.getOrCreateMulticast();
    multicast.add(observer, options);

    const subscriberActive = this.subscriber?.active ?? false;
    const subscriber = this.getOrCreateSubscriber(multicast, {
      signal: multicast.signal,
      onError: this.onError,
    });

    if (!subscriberActive) {
      try {
        this.executor(subscriber);
      } catch (error) {
        subscriber.error(error);
      }
    }
  }

  /**
   * Возвращает мультикаст если он уже создан и если subscriber ещё активен.
   * В ином случае создаёт мультикаст и возращает его
   */
  private getOrCreateMulticast(): MulticastObserver<T> {
    if (this.multicast && this.subscriber && this.subscriber.active) {
      return this.multicast;
    }

    this.multicast = new MulticastObserver({ onError: this.onError });
    return this.multicast;
  }

  /**
   * Возвращает subscriber, если он уже создан и активен.
   * В ином случае, создаёт новый subscriber и возвращает его
   */
  private getOrCreateSubscriber(
    observer: IObserver<T>,
    options: SubscriberConstructorOptions
  ): ISubscriber<T> {
    if (this.subscriber && this.subscriber.active) {
      return this.subscriber;
    }

    this.subscriber = new Subscriber(observer, options);

    return this.subscriber;
  }
}
