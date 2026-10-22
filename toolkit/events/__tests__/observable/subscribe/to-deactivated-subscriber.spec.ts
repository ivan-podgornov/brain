import { describe, expect, it } from 'vitest';

import { AbortController } from '../../../src/abort-controller';
import type { ISubscriber } from '../../../src/subscriber';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultSubscribeOptions,
} from '../helpers';

const closers = [
  {
    title: 'subscriber.complete',
    close: (subscriber: ISubscriber<unknown>) => subscriber.complete(),
  },
  {
    title: 'subscriber.error',
    close: (subscriber: ISubscriber<unknown>) => subscriber.error(new Error('subscriber failed')),
  },
  {
    title: 'отписки последнего подписчика',
    close: (_: ISubscriber<unknown>, controller: AbortController) => controller.abort(),
  },
];

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При подписке к observable, subscriber которого уже деактивирован', () => {
      describe.each(closers)('При новой подписке на observable, после $title', ({ close }) => {
        it('Вызывает executor повторно', () => {
          const controller = new AbortController();
          const { observable, executor, subscriber } = createControlledObservable();

          observable.subscribe(createMockedObserver(), {
            ...getDefaultSubscribeOptions(),
            signal: controller.signal,
          });
          close(subscriber, controller);
          observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());

          expect(executor).toHaveBeenCalledTimes(2);
        });

        it('Значения нового subscriber доходят до нового наблюдателя, а до старого не доходят', () => {
          const controller = new AbortController();
          const { observable, subscriber } = createControlledObservable();
          const oldObserver = createMockedObserver();
          const newObserver = createMockedObserver();

          observable.subscribe(oldObserver, {
            ...getDefaultSubscribeOptions(),
            signal: controller.signal,
          });
          close(subscriber, controller);
          oldObserver.next.mockClear();
          observable.subscribe(newObserver, getDefaultSubscribeOptions());
          subscriber.next('new value');

          expect(newObserver.next).toHaveBeenCalledExactlyOnceWith('new value');
          expect(oldObserver.next).not.toHaveBeenCalled();
        });
      });
    });
  });
});
