import type { IAbortSignalState } from '../types';

export class PendingState implements IAbortSignalState {
  readonly aborted = false;
  readonly reason = undefined;

  throwIfAborted(): void {
    return;
  }
}
