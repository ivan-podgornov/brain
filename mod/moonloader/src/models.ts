/**
 * Интерфейс функций для работы с моделями в MoonLoader
 */
interface ModelsGlobal {
  /** Загружает указанную модель */
  requestModel(this: void, modelId: number): boolean;

  /** Загрузка ранее запрошенных моделей */
  loadAllModelsNow(this: void): void;

  /** Проверяет загрузку модели */
  hasModelLoaded(this: void, modelId: number): boolean;

  /** Помечает загруженную ранее модель как более ненужную для скриптового движка */
  markModelAsNoLongerNeeded(this: void, modelId: number): void;

  /** Загружает спецэффект */
  requestSpecialModel(this: void, slot: number, modelId: number): void;

  /** Проверяет загрузку спецэффекта */
  hasSpecialCharacterLoaded(this: void, slot: number): boolean;

  /** Загружает анимацию */
  requestAnimation(this: void, animName: string): void;

  /** Проверяет загрузку анимации */
  hasAnimationLoaded(this: void, animName: string): boolean;

  /** Удаляет анимацию из памяти */
  removeAnimation(this: void, animName: string): void;
}

declare const _G: ModelsGlobal;

export const {
  requestModel,
  loadAllModelsNow,
  hasModelLoaded,
  markModelAsNoLongerNeeded,
  requestSpecialModel,
  hasSpecialCharacterLoaded,
  requestAnimation,
  hasAnimationLoaded,
  removeAnimation,
} = _G;
