import { describe, expect, it, vi } from 'vitest';

import { Observable } from '../../src/observable';

describe('Observable', () => {
  describe('#constructor', () => {
    it('Не вызывает переданный callback-executor', () => {
      const executor = vi.fn();

      new Observable(executor);

      expect(executor).not.toHaveBeenCalled();
    });
  });
});
