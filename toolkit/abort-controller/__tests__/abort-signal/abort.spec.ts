import { describe, expect, it } from 'vitest';

import { AbortSignal } from '../../src/abort-signal';

describe('AbortSignal.abort', () => {
  it('Возвращает сигнал, который изначально в состоянии aborted', () => {
    const signal = AbortSignal.abort();

    expect(signal.aborted).toBe(true);
  });

  it('Причиной перехода такого сигнала в состояние aborted является параметр метода', () => {
    const reason = 'Причина';
    const signal = AbortSignal.abort(reason);

    expect(signal.reason).toBe(reason);
  });

  it('Причиной перехода такого сигнала в состояние aborted является AbortError, если параметр метода не был указан', () => {
    const signal = AbortSignal.abort();

    expect(signal.reason).toHaveProperty('name', 'AbortError');
  });
});
