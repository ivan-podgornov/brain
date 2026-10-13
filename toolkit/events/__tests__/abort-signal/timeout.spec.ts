import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AbortSignal } from '../../src/abort-signal';

describe('AbortSignal.timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('Возвращает сигнал, который изначально в состоянии pending', () => {
    const signal = AbortSignal.timeout(1000);

    expect(signal.aborted).toBe(false);
  });

  it('Сигнал в состоянии pending до истечения таймаута', () => {
    const signal = AbortSignal.timeout(1000);
    vi.advanceTimersByTime(999);

    expect(signal.aborted).toBe(false);
  });

  it('Возвращает сигнал, который при истечении таймаута в параметре метода переходит в состояние aborted', () => {
    const signal = AbortSignal.timeout(1000);
    vi.advanceTimersByTime(1000);

    expect(signal.aborted).toBe(true);
  });

  it('Причиной перехода сигнала в состояние aborted, является TimeoutError', () => {
    const signal = AbortSignal.timeout(1000);
    vi.advanceTimersByTime(1000);

    expect(signal.reason).toHaveProperty('name', 'TimeoutError');
  });
});
