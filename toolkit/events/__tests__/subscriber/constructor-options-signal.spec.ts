import { describe, expect, it } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { AbortSignal } from '../../src/abort-signal';
import { Subscriber } from '../../src/subscriber/subscriber';

import { describeBehaviorOnDeactivation } from './describe-behavior-on-deactivation';
import { describeBehaviorOnRepeatDeactivation } from './describe-behaviour-on-repeat-deactivation';
import { createMockedObserver, getDefaultConstructorOptions } from './helpers';

describe('Subscriber', () => {
  describe('#constructor', () => {
    describe('При options.signal, который изначально в состоянии aborted', () => {
      it('Подписка создаётся сразу в неактивном состоянии', () => {
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: AbortSignal.abort('some reason'),
        });

        expect(subscriber.active).toBe(false);
      });

      it('subscriber.signal сразу же в состоянии aborted', () => {
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: AbortSignal.abort('some reason'),
        });

        expect(subscriber.signal.aborted).toBe(true);
      });

      it('Причиной перехода subscriber.signal в состояние aborted является причина перехода options.signal', () => {
        const reason = 'some reason';
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: AbortSignal.abort(reason),
        });

        expect(subscriber.signal.reason).toBe(reason);
      });
    });

    describe('При переходе options.signal в состояние aborted', () => {
      it('Причиной перехода subscriber.signal в состояние aborted является причина перехода options.signal', () => {
        const reason = 'some reason';
        const controller = new AbortController();
        const subscriber = new Subscriber(createMockedObserver(), {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        controller.abort(reason);

        expect(subscriber.signal.reason).toBe(reason);
      });

      describeBehaviorOnDeactivation('signal.abort');
      describeBehaviorOnRepeatDeactivation('signal.abort');

      describe('Если observer указан в виде объекта с методом error', () => {
        it('Не приводит к вызову observer.error', () => {
          const controller = new AbortController();
          const observer = createMockedObserver();
          new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            signal: controller.signal,
          });

          controller.abort();

          expect(observer.error).not.toHaveBeenCalled();
        });
      });

      describe('Если observer указан в виде объекта с методом complete', () => {
        it('Не приводит к вызову observer.complete', () => {
          const controller = new AbortController();
          const observer = createMockedObserver();
          new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            signal: controller.signal,
          });

          controller.abort();

          expect(observer.complete).not.toHaveBeenCalled();
        });
      });
    });
  });
});
