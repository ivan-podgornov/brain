/**
 * Интерфейс функций для работы с текстом в MoonLoader
 */
interface TextGlobal {
  /** Отрисовывает текст на экране */
  displayText(this: void, x: number, y: number, text: string): void;

  /** Устанавливает размер шрифта */
  setTextScale(this: void, width: number, height: number): void;

  /** Устанавливает цвет текста */
  setTextColour(this: void, r: number, g: number, b: number, a: number): void;

  /** Устанавливает шрифт */
  setTextFont(this: void, font: number): void;

  /** Устанавливает выравнивание текста */
  setTextJustify(this: void, justify: number): void;

  /** Устанавливает границу текста */
  setTextEdge(this: void, size: number, r: number, g: number, b: number, a: number): void;

  /** Устанавливает пропорциональность текста */
  setTextProportional(this: void, state: boolean): void;

  /** Устанавливает центрирование текста */
  setTextCentre(this: void, state: boolean): void;

  /** Устанавливает перенос текста */
  setTextWrapx(this: void, x: number): void;

  /** Устанавливает тень текста */
  setTextDropshadow(this: void, size: number, r: number, g: number, b: number, a: number): void;

  /** Рисует прямоугольник на экране */
  drawRect(
    this: void,
    x: number,
    y: number,
    width: number,
    height: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void;

  /** Рисует текстуру */
  drawTexture(
    this: void,
    texture: number,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number,
    r: number,
    g: number,
    b: number,
    a: number
  ): void;

  /** Получает разрешение экрана */
  getScreenResolution(this: void): LuaMultiReturn<[number, number]>;

  /** Конвертирует 3D координаты в экранные */
  convert3dCoordsToScreen(
    this: void,
    x: number,
    y: number,
    z: number
  ): LuaMultiReturn<[boolean, number, number]>;

  /** Конвертирует экранные координаты в 3D */
  convertScreenCoordsTo3d(
    this: void,
    screenX: number,
    screenY: number
  ): LuaMultiReturn<[number, number, number]>;
}

declare const _G: TextGlobal;

export const {
  displayText,
  setTextScale,
  setTextColour,
  setTextFont,
  setTextJustify,
  setTextEdge,
  setTextProportional,
  setTextCentre,
  setTextWrapx,
  setTextDropshadow,
  drawRect,
  drawTexture,
  getScreenResolution,
  convert3dCoordsToScreen,
  convertScreenCoordsTo3d,
} = _G;
