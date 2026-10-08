import { describe, expect, it } from 'vitest';

import { HTN, getDefaultDeps } from '../../../src/htn';
import { getDummyExecutor, getDummyPlanner, primitive, testState } from '../../helpers';

describe('HTN', () => {
  describe('#update', () => {
    describe('После остановки выполнения', () => {
      it('Если задачи ещё не начинали выполняться, планирует root задачу с состоянием, с которым вызвался update', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.stop(); // остановили выполнение
        htn.update(testState); // спланировали

        expect(planner.plan).toHaveBeenCalledExactlyOnceWith(root, testState);
      });

      it('Если задачи уже начинали выполняться, перепланирует root задачу с состоянием, с которым вызвался update', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState); // спланировали, начали выполнять
        htn.stop(); // остановили выполнение
        htn.update(testState); // перепланировали

        expect(planner.plan).toHaveBeenCalledTimes(2);
        expect(planner.plan).toHaveBeenLastCalledWith(root, testState);
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

        htn.stop(); // остановили выполнение
        htn.update(testState); // спланировали

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

        htn.stop(); // остановили выполнение
        htn.update(testState); // спланировали и начали выполнять

        expect(executor.update).toHaveBeenCalledWith(testState);
      });
    });
  });
});
