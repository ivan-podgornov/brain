import { describe, expect, it, vi } from 'vitest';

import { MulticastObserver } from '../../src/multicast-observer';

import {
  callMethod,
  createObserverWithMethod,
  getDefaultMulticastOptions,
  getDefaultObserveOptions,
} from './helpers';

type DescribeSignalFinishOptions = {
  /** Метод для которого нужно проверить завершение сигнала */
  method: 'complete' | 'error';
  /** Причина, с которой сигнал MulticastObserver переходит в состояние aborted, при вызове метода */
  reason: unknown;
};

export function describeSignalFinish(options: DescribeSignalFinishOptions) {
  const { method, reason } = options;

  describe(`Сигнал после вызова ${method}`, () => {
    it('Переходит в состояние aborted', () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      callMethod(multicast, method);

      expect(multicast.signal.aborted).toBe(true);
    });

    it(`Причиной перехода сигнала в состояние aborted является ${String(reason)}`, () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());

      callMethod(multicast, method);

      expect(multicast.signal.reason).toBe(reason);
    });

    it(`Обработчик ${method} наблюдателя вызывается раньше, чем сигнал переходит в состояние aborted`, () => {
      const multicast = new MulticastObserver(getDefaultMulticastOptions());
      const implementation = vi.fn(() => multicast.signal.aborted);
      const observer = createObserverWithMethod({ method }, implementation);

      multicast.add(observer, getDefaultObserveOptions());
      callMethod(multicast, method);

      expect(implementation).toHaveReturnedWith(false);
    });
  });
}
