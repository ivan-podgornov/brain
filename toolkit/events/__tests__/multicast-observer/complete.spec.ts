import { describe } from 'vitest';

import { describeBehaviourOnErrorInObserver } from './describe-behaviour-on-error-in-observer';
import { describeBehaviourWhenMethodAbsent } from './describe-behaviour-when-method-absent';
import { describeRecallObserver } from './describe-recall-observers';
import { describeSignalFinish } from './describe-signal-finish';

describe('MulticastObserver', () => {
  describe('#complete', () => {
    describeRecallObserver({ method: 'complete' });
    describeBehaviourOnErrorInObserver({ method: 'complete' });
    describeBehaviourWhenMethodAbsent({ method: 'complete', observerAsFunction: false });
    describeBehaviourWhenMethodAbsent({ method: 'complete', observerAsFunction: true });
    describeSignalFinish({ method: 'complete', reason: 'subscriber success' });
  });
});
