import { vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import type { IObserver, ISubscriber } from '../../src/subscriber';
import type { SubscriberConstructorOptions } from '../../src/subscriber/subscriber';

export function createMockedObserver() {
  return {
    next: vi.fn(),
    complete: vi.fn(),
    error: vi.fn(),
  } satisfies IObserver<unknown>;
}

export function getDefaultConstructorOptions(): SubscriberConstructorOptions {
  return {};
}

export type DeactivateMethod = 'complete' | 'error' | 'signal.abort';

export function createDeactivator(method: DeactivateMethod) {
  return (subscriber: ISubscriber<unknown>, controller: AbortController) => {
    if (method === 'complete') {
      subscriber.complete();
      return;
    }

    if (method === 'error') {
      subscriber.error('some error');
      return;
    }

    if (method === 'signal.abort') {
      controller.abort();
      return;
    }
  };
}
