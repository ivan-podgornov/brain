import type { Listener, IEventTarget } from '../event-target';

export type AbortSignalEvents = {
  abort?: unknown;
};

export type Abort = (reason?: unknown) => void;

export type AbortListener = Listener<AbortSignalEvents['abort']>;

export type AbortSignalExecutor = (abort: Abort) => void;

export interface IAbortSignal extends IEventTarget<AbortSignalEvents> {
  readonly aborted: boolean;
  readonly reason: unknown;

  throwIfAborted(): void;
}

export type IAbortSignalState = Pick<IAbortSignal, 'aborted' | 'reason' | 'throwIfAborted'>;
