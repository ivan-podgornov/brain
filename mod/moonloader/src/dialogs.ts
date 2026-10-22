/**
 * Интерфейс функций для работы с диалогами в MoonLoader
 */
interface DialogsGlobal {
  /** Проверяет, активен ли диалог */
  isDialogActive(this: void): boolean;

  /** Показывает диалоговое окно */
  showDialog(
    this: void,
    dialogId: number,
    style: number,
    title: string,
    button1: string,
    button2: string,
    text: string
  ): void;

  /** Обрабатывает ответ диалога */
  processDialogResponse(this: void): LuaMultiReturn<[boolean, number, number, number, string]>;

  /** Показывает меню */
  showTextdraw(this: void, textdrawId: number): void;

  /** Скрывает меню */
  hideTextdraw(this: void, textdrawId: number): void;
}

declare const _G: DialogsGlobal;

export const { isDialogActive, showDialog, processDialogResponse, showTextdraw, hideTextdraw } = _G;
