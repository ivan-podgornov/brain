import type { IAbortSignalState } from '../types';

export class AbortedState implements IAbortSignalState {
  readonly aborted = true;
  readonly reason: unknown;

  constructor(reason: unknown) {
    this.reason = reason;
  }

  throwIfAborted(): void {
    throw this.reason;
  }
}
