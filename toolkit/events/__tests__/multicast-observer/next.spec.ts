import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { MulticastObserver } from '../../src/multicast-observer';

import { describeBehaviourOnErrorInObserver } from './describe-behaviour-on-error-in-observer';
import { describeBehaviourWhenMethodAbsent } from './describe-behaviour-when-method-absent';
import { describeRecallObserver } from './describe-recall-observers';

import {
  createMockedObserver,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

describe('MulticastObserver', () => {
  describe('#next', () => {
    describeRecallObserver({ method: 'next', observerAsFunction: true });
    describeRecallObserver({ method: 'next', observerAsFunction: false });

    describeBehaviourOnErrorInObserver({ method: 'next', observerAsFunction: true });
    describeBehaviourOnErrorInObserver({ method: 'next', observerAsFunction: false });

    describeBehaviourWhenMethodAbsent({ method: 'next', observerAsFunction: true });
    describeBehaviourWhenMethodAbsent({ method: 'next', observerAsFunction: false });

    describe('Изменение набора наблюдателей во время рассылки', () => {
      describe('Если наблюдатель добавляет нового наблюдателя во время next', () => {
        it('Новый наблюдатель не получает текущее значение', () => {
          const multicast = new MulticastObserver(getDefaultMulticastOptions());
          const lateObserver = createMockedObserver();

          multicast.add(() => {
            multicast.add(lateObserver, getDefaultObserveOptions());
          }, getDefaultObserveOptions());
          multicast.next('current value');

          expect(lateObserver.next).not.toHaveBeenCalled();
        });

        it('Новый наблюдатель получает следующие значения', () => {
          const multicast = new MulticastObserver(getDefaultMulticastOptions());
          const lateObserver = createMockedObserver();
          // Добавляет нового наблюдателя только при первом вызове
          const addLateObserver = vi.fn().mockImplementationOnce(() => {
            multicast.add(lateObserver, getDefaultObserveOptions());
          });

          multicast.add(addLateObserver, getDefaultObserveOptions());
          multicast.next('first value');
          multicast.next('second value');

          expect(lateObserver.next).toHaveBeenCalledExactlyOnceWith('second value');
        });
      });

      describe('Если наблюдатель отписывает другого наблюдателя во время next', () => {
        it('Отписанный наблюдатель не получает текущее значение', () => {
          const controller = new AbortController();
          const unsubscribedObserver = createMockedObserver();
          const multicast = new MulticastObserver(getDefaultMulticastOptions());

          multicast.add(() => controller.abort(), getDefaultObserveOptions());
          multicast.add(unsubscribedObserver, {
            ...getDefaultObserveOptions(),
            signal: controller.signal,
          });
          multicast.next('current value');

          expect(unsubscribedObserver.next).not.toHaveBeenCalled();
        });

        it('Остальные наблюдатели получают текущее значение', () => {
          const controller = new AbortController();
          const otherObserver = createMockedObserver();
          const multicast = new MulticastObserver(getDefaultMulticastOptions());

          multicast.add(() => controller.abort(), getDefaultObserveOptions());
          multicast.add(createMockedObserver(), {
            ...getDefaultObserveOptions(),
            signal: controller.signal,
          });
          multicast.add(otherObserver, getDefaultObserveOptions());
          multicast.next('current value');

          expect(otherObserver.next).toHaveBeenCalledExactlyOnceWith('current value');
        });
      });

      describe('Если наблюдатель отписывает сам себя во время next', () => {
        it('Остальные наблюдатели получают текущее значение', () => {
          const controller = new AbortController();
          const otherObserver = createMockedObserver();
          const multicast = new MulticastObserver(getDefaultMulticastOptions());

          multicast.add(() => controller.abort(), {
            ...getDefaultObserveOptions(),
            signal: controller.signal,
          });
          multicast.add(otherObserver, getDefaultObserveOptions());
          multicast.next('current value');

          expect(otherObserver.next).toHaveBeenCalledExactlyOnceWith('current value');
        });
      });
    });
  });
});
