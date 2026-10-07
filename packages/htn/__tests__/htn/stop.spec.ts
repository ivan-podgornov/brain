import { describe, expect, it } from 'vitest';

import { HTN, getDefaultDeps } from '../../src/htn';
import type { TaskResult } from '../../src/task';
import { getDummyExecutor, getDummyPlanner, primitive, testState } from '../helpers';

describe('HTN', () => {
  describe('#stop', () => {
    it('Если задачи уже начали выполняться, останавливает выполнение', () => {
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

      expect(executor.stop).toHaveBeenCalledOnce();
    });

    it.each([
      ['success', 'успешно'],
      ['failed', 'с ошибкой'],
    ] as [TaskResult, string][])(
      'Если выполнение задач завершено $1, останавливать нечего - executor.stop не вызывается',
      (status) => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor(status);
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState); // Первый вызов, задачи запланировались, начали выполняться и выполнение завершилось со статусом status
        htn.update(testState); // Второй вызов, должна произойти новая попытка планирования

        expect(executor.stop).not.toHaveBeenCalled();
      }
    );

    it('Если задачи ещё не начинали выполняться, останавливать нечего - executor.stop не вызывается', () => {
      const root = primitive('Primitive Task');
      const executor = getDummyExecutor('running');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => planner,
      });

      htn.stop(); // остановили выполнение

      expect(executor.stop).not.toHaveBeenCalled();
    });
  });
});
