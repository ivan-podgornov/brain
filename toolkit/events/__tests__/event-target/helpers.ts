import { EventTarget } from '../../src';
import type { IAbortSignal } from '../../src/event-target/types';

export const optionsCases = [
  { name: 'без опций', options: undefined },
  { name: 'once: false', options: { once: false } },
  { name: 'once: true', options: { once: true } },
] as const;

export type TestEvents = {
  tick: [];
  update: [count: number];
};

export function createMockedAbortSignal(aborted: boolean): IAbortSignal {
  const target = new EventTarget<{ abort: [reason?: unknown] }>();

  return {
    aborted,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    when: target.when.bind(target),
  };
}
