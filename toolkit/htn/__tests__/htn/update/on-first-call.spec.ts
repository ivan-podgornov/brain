import { describe, expect, it } from 'vitest';

import { HTN, getDefaultDeps } from '../../../src/htn';
import { getDummyExecutor, getDummyPlanner, primitive, testState } from '../../helpers';

describe('HTN', () => {
  describe('#update', () => {
    describe('При первом вызове', () => {
      it('Планирует root задачу с состоянием, с которым вызвался update', () => {
        const root = primitive('Primitive Task');
        const planner = getDummyPlanner([root]);

        const htn = new HTN(root, { ...getDefaultDeps(), plannerFactory: () => planner });
        htn.update(testState);

        expect(planner.plan).toHaveBeenCalledExactlyOnceWith(root, testState);
      });

      it('Если планирование не удалось, не запускает выполнение', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner(null);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState);

        expect(executor.update).not.toHaveBeenCalled();
      });

      it('Если планирование удалось, запускает выполнение с состоянием, которое было передано в параметре метода', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState);

        expect(executor.update).toHaveBeenCalledExactlyOnceWith(testState);
      });
    });
  });
});
