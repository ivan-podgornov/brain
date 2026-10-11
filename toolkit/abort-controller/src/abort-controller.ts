import { AbortSignal } from './abort-signal';

import type { Abort } from './types';

export class AbortController {
  readonly signal: AbortSignal;

  private signalAbort!: Abort;

  constructor() {
    this.signal = new AbortSignal((abort) => {
      this.signalAbort = abort;
    });
  }

  abort(reason?: unknown) {
    this.signalAbort(reason);
  }
}
