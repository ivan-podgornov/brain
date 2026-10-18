import { describe, it, expect } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { AbortSignal } from '../../src/abort-signal';
import { MulticastObserver } from '../../src/multicast-observer';

import {
  createMockedObserver,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

describe('MulticastObserver', () => {
  describe('#signal', () => {
    it('Сигнал находится в состоянии pending, если ни один из наблюдателей не был передан', () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      expect(multicast.signal.aborted).toBe(false);
    });

    it('Сигнал находится в состоянии pending, если наблюдатель добавлен без параметра signal', () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const observer = createMockedObserver();
      const { signal, ...optionsWithoutSignal } = getDefaultObserveOptions();

      multicast.add(observer, optionsWithoutSignal);

      expect(multicast.signal.aborted).toBe(false);
    });

    it('Сигнал находится в состоянии pending, если сигнал хотя бы одного из переданных наблюдателей в состоянии pending', () => {
      const abortController = new AbortController();
      const firstObserver = createMockedObserver();
      const secondObserver = createMockedObserver();
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, {
        ...getDefaultObserveOptions(),
        signal: abortController.signal,
      });
      abortController.abort();

      expect(multicast.signal.aborted).toBe(false);
    });

    it('Сигнал находится в состоянии pending, если один и тот же наблюдатель добавить несколько раз, но с разными сигналами, один из которых pending', () => {
      const firstAbortController = new AbortController();
      const secondAbortController = new AbortController();
      const observer = createMockedObserver();
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: firstAbortController.signal,
      });
      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: secondAbortController.signal,
      });

      firstAbortController.abort();

      expect(multicast.signal.aborted).toBe(false);
    });

    it('Если добавить единственного наблюдателя с сигналом в состоянии aborted, сигнал переходит в состояние aborted', () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const observer = createMockedObserver();

      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: AbortSignal.abort(),
      });

      expect(multicast.signal.aborted).toBe(true);
    });

    it('Если добавить единственного наблюдателя с сигналом в состоянии aborted, причиной перехода сигнала в состояние aborted, будет причина переданного сигнала', () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const observer = createMockedObserver();

      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: AbortSignal.abort('reason'),
      });

      expect(multicast.signal.reason).toBe('reason');
    });

    it('Если добавить наблюдателя с сигналом в состоянии aborted к наблюдателю без этого сигнала, сигнал MulticastObserver продолжит быть в состоянии pending', () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const observer = createMockedObserver();

      multicast.add(createMockedObserver(), getDefaultObserveOptions());
      multicast.add(observer, {
        ...getDefaultObserveOptions(),
        signal: AbortSignal.abort('reason'),
      });

      expect(multicast.signal.aborted).toBe(false);
    });

    it('Сигнал переходит в состояние aborted, если сигналы всех добавленных наблюдателей перешли в состояние aborted', () => {
      const firstObserverAbortController = new AbortController();
      const firstObserver = createMockedObserver();
      const secondObserver = createMockedObserver();
      const secondObserverAbortController = new AbortController();
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(firstObserver, {
        ...getDefaultObserveOptions(),
        signal: firstObserverAbortController.signal,
      });
      multicast.add(secondObserver, {
        ...getDefaultObserveOptions(),
        signal: secondObserverAbortController.signal,
      });

      firstObserverAbortController.abort();
      secondObserverAbortController.abort();

      expect(multicast.signal.aborted).toBe(true);
    });

    it('Причиной перехода сигнала в состояние aborted, является причина перехода последнего перешедшего в это состояние сигнала наблюдателя', () => {
      const firstObserverAbortController = new AbortController();
      const firstObserver = createMockedObserver();
      const secondObserver = createMockedObserver();
      const secondObserverAbortController = new AbortController();
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      multicast.add(firstObserver, {
        ...getDefaultObserveOptions(),
        signal: firstObserverAbortController.signal,
      });
      multicast.add(secondObserver, {
        ...getDefaultObserveOptions(),
        signal: secondObserverAbortController.signal,
      });

      secondObserverAbortController.abort('second observer aborted');
      firstObserverAbortController.abort('first observer aborted');

      expect(multicast.signal.reason).toBe('first observer aborted');
    });
  });
});
