import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { AbortSignal } from '../../src/abort-signal';
import { alwaysPendingSignalExecutor, immediatelyAbortedSignalExecutor } from '../helpers';

describe('AbortSignal.any', () => {
  it('Если хотя бы один из сигналов-источников в состоянии aborted, возвращает сигнал в состоянии aborted', () => {
    const signal = AbortSignal.any([
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(immediatelyAbortedSignalExecutor()),
    ]);

    expect(signal.aborted).toBe(true);
  });

  it('Если список сигналов-источников пуст, возвращает сигнал в состоянии pending', () => {
    const signal = AbortSignal.any([]);

    expect(signal.aborted).toBe(false);
  });

  it('Возвращает сигнал в состоянии pending, если все переданные сигналы в состоянии pending', () => {
    const signal = AbortSignal.any([
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(alwaysPendingSignalExecutor()),
    ]);

    expect(signal.aborted).toBe(false);
  });

  it('Возвращает сигнал, который переходит в состояние aborted, если хотя бы один из переданных сигналов перейдёт в это состояние', () => {
    const controller = new AbortController();
    const signal = AbortSignal.any([
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(alwaysPendingSignalExecutor()),
      controller.signal,
    ]);

    controller.abort();

    expect(signal.aborted).toBe(true);
  });

  it('Причиной перехода в состояние aborted, является причина сигнала который стал триггером к переходу', () => {
    const controller = new AbortController();
    const reason = 'reason';
    const signal = AbortSignal.any([
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(alwaysPendingSignalExecutor()),
      controller.signal,
    ]);

    controller.abort(reason);

    expect(signal.reason).toBe(reason);
  });

  it('Если один из сигналов-источников в состоянии aborted, причину перехода в состояние aborted, является причина этого сигнала', () => {
    const reason = 'reason';
    const signal = AbortSignal.any([
      new AbortSignal(alwaysPendingSignalExecutor()),
      new AbortSignal(alwaysPendingSignalExecutor()),
      AbortSignal.abort(reason),
    ]);

    expect(signal.reason).toBe(reason);
  });

  it('Повторный переход сигналов-источников не приводит к вызову события abort', () => {
    const listener = vi.fn();
    const firstController = new AbortController();
    const secondController = new AbortController();
    const reason = 'reason';
    const signal = AbortSignal.any([firstController.signal, secondController.signal]);

    signal.addEventListener('abort', listener);
    firstController.abort(reason);
    secondController.abort(reason);

    expect(listener).toHaveBeenCalledOnce();
  });
});
