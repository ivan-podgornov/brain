import { describe, expect, it, vi } from 'vitest';

import { Observable } from '../../../src/observable';

import {
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    it('Если observer не задан, не выбрасывает ошибку', () => {
      const observable = new Observable(() => {}, getDefaultObservableOptions());

      expect(() => observable.subscribe()).not.toThrow();
    });

    it('Вызывает колбэк-executor, переданный в конструктор, один раз', () => {
      const executor = vi.fn();
      const observable = new Observable(executor, getDefaultObservableOptions());

      observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());

      expect(executor).toHaveBeenCalledOnce();
    });
  });
});
