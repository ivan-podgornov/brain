import type { Listener } from '@brain/event-emitter';

export type AbortSignalEvents = {
  abort?: unknown;
};

export type Abort = (reason?: unknown) => void;

export type AbortListener = Listener<AbortSignalEvents['abort']>;

export type AbortSignalExecutor = (abort: Abort) => void;

export interface IAbortSignalState {
  readonly aborted: boolean;
  readonly reason: unknown;

  throwIfAborted(): void;
}
