import { describe, expect, it } from 'vitest';

import { AbortController } from '../../src/abort-controller';

describe('AbortController', () => {
  describe('#abort', () => {
    it('Причиной перехода controller.signal в состояние aborted является параметр метода abort', () => {
      const controller = new AbortController();
      const reason = 'Потому что так захотелось';

      controller.abort(reason);

      expect(controller.signal.reason).toBe(reason);
    });

    it('Повторный вызов abort с другой причиной не меняет причину перехода сигнала в состояние aborted', () => {
      const reason = 'Причина';
      const controller = new AbortController();

      controller.abort(reason);
      controller.abort('Новая причина');

      expect(controller.signal.reason).toBe(reason);
    });
  });
});
