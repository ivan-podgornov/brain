import type { IAbortSignal } from '../abort-signal';
import type { ISubscriber } from '../subscriber';

export type ErrorHandler = (error?: unknown) => void;

export type Executor<T> = (subscriber: ISubscriber<T>) => void;

export type ObservableOptions = {
  onError?: ErrorHandler;
};

export type SubscribeOptions = {
  signal?: IAbortSignal;
};
