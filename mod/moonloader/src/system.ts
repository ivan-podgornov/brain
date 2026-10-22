export type VKey = (typeof import('vkeys'))[keyof typeof import('vkeys')];

/**
 * Интерфейс системных функций MoonLoader
 */
interface SystemGlobal {
  /** Выводит текст в файл moonloader.log и вызывает событие onScriptMessage */
  print(this: void, text: string): void;

  /** Приостанавливает выполнение скрипта */
  wait(this: void, timeInMs: number): void;

  /** Выводит текст в нижней части экрана, минуя очередь */
  printStringNow(this: void, text: string, timeInMs: number): void;

  /** Выводит текст с префиксом в нижней части экрана */
  printString(this: void, text: string, timeInMs: number): void;

  /** Выводит отформатированную строку с префиксом */
  printStringWithLiteralStringNow(
    this: void,
    prefix: string,
    text: string,
    timeInMs: number,
    flag: number
  ): void;

  /** Выводит большой текст на экран */
  printBig(this: void, text: string, timeInMs: number, style: number): void;

  /** Очищает очередь всех текстов */
  clearPrints(this: void): void;

  /** Проверяет, отображается ли сейчас текст-подсказка */
  isHelpMessageBeingDisplayed(this: void): boolean;

  /** Проверяет, нажата ли клавиша */
  isKeyPressed(this: void, key: VKey): boolean;

  /** Проверяет, была ли клавиша нажата */
  wasKeyPressed(this: void, key: VKey): boolean;

  /** Получает имя текущего скрипта */
  thisScript(this: void): string;

  /** Выгружает скрипт */
  unloadScript(this: void, scriptName: string): void;

  /** Перезагружает скрипт */
  reloadScript(this: void, scriptName: string): void;

  /** Получает список всех скриптов */
  getAllScripts(this: void): string[];

  /** Проверяет загружен ли скрипт */
  isScriptLoaded(this: void, scriptName: string): boolean;

  /** Получает FPS */
  getFramerate(this: void): number;

  /** Проверяет, стоит ли игра на паузе */
  isGamePaused(this: void): boolean;

  /** Получает версию игры */
  getGameVersion(this: void): string;

  /** Получает указатель на игрока */
  getPlayerPointer(this: void): number;

  /** Проверяет, в игре ли игрок */
  isPlayerPlaying(this: void): boolean;
}

declare const _G: SystemGlobal;

export const {
  print,
  wait,
  printStringNow,
  printString,
  printStringWithLiteralStringNow,
  printBig,
  clearPrints,
  isHelpMessageBeingDisplayed,
  isKeyPressed,
  wasKeyPressed,
  thisScript,
  unloadScript,
  reloadScript,
  getAllScripts,
  isScriptLoaded,
  getFramerate,
  isGamePaused,
  getGameVersion,
  getPlayerPointer,
  isPlayerPlaying,
} = _G;
