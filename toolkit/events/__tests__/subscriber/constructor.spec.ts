import { describe, expect, it } from 'vitest';

import { Subscriber } from '../../src/subscriber/subscriber';

import { createMockedObserver, getDefaultConstructorOptions } from './helpers';

describe('Subscriber', () => {
  describe('#constructor', () => {
    it('Создаёт subscriber в активном состоянии', () => {
      const subscriber = new Subscriber(createMockedObserver(), getDefaultConstructorOptions());

      expect(subscriber.active).toBe(true);
    });

    it('Создаёт subscriber, сигнал которого в pending состоянии', () => {
      const subscriber = new Subscriber(createMockedObserver(), getDefaultConstructorOptions());

      expect(subscriber.signal.aborted).toBe(false);
    });
  });
});
