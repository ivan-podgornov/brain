import { EventEmitter } from '../../src';
import type { IAbortSignal } from '../../src/event-emitter/types';

export const optionsCases = [
  { name: 'без опций', options: undefined },
  { name: 'once: false', options: { once: false } },
  { name: 'once: true', options: { once: true } },
] as const;

export type TestEvents = {
  tick: undefined;
  update: number;
};

export function createMockedAbortSignal(aborted: boolean): IAbortSignal {
  const emitter = new EventEmitter<{ abort: 'unknown' }>();

  return {
    aborted,
    addEventListener: emitter.addEventListener.bind(emitter),
    removeEventListener: emitter.removeEventListener.bind(emitter),
    dispatchEvent: emitter.dispatchEvent.bind(emitter),
  };
}
