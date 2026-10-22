import type {
  BlipHandle,
  CheckpointHandle,
  ObjectHandle,
  PedHandle,
  VehicleHandle,
} from './handles';

/**
 * Интерфейс функций для работы с маркерами и иконками в MoonLoader
 */
interface MarkerGlobal {
  /** Создает маркер */
  createCheckpoint(
    this: void,
    type: number,
    x: number,
    y: number,
    z: number,
    pointX: number,
    pointY: number,
    pointZ: number,
    radius: number
  ): CheckpointHandle;

  /** Удаляет маркер */
  deleteCheckpoint(this: void, checkpoint: CheckpointHandle): void;

  /** Создает иконку на радаре */
  addBlipForCoord(this: void, x: number, y: number, z: number): BlipHandle;

  /** Создает иконку на персонаже */
  addBlipForChar(this: void, ped: PedHandle): BlipHandle;

  /** Создает иконку на машине */
  addBlipForCar(this: void, car: VehicleHandle): BlipHandle;

  /** Создает иконку на объекте */
  addBlipForObject(this: void, obj: ObjectHandle): BlipHandle;

  /** Создает иконку контактной точки */
  addBlipForContactPoint(this: void, x: number, y: number, z: number): BlipHandle;

  /** Удаляет иконку */
  removeBlip(this: void, blip: BlipHandle): void;

  /** Проверяет существование иконки */
  doesBlipExist(this: void, blip: BlipHandle): boolean;

  /** Устанавливает цвет иконки */
  changeBlipColour(this: void, blip: BlipHandle, color: number): void;

  /** Уменьшает/увеличивает иконку */
  changeBlipScale(this: void, blip: BlipHandle, scale: number): void;

  /** Устанавливает отображение иконки */
  changeBlipDisplay(this: void, blip: BlipHandle, display: number): void;

  /** Получает координаты иконки */
  getBlipCoords(this: void, blip: BlipHandle): LuaMultiReturn<[number, number, number]>;
}

declare const _G: MarkerGlobal;

export const {
  createCheckpoint,
  deleteCheckpoint,
  addBlipForCoord,
  addBlipForChar,
  addBlipForCar,
  addBlipForObject,
  addBlipForContactPoint,
  removeBlip,
  doesBlipExist,
  changeBlipColour,
  changeBlipScale,
  changeBlipDisplay,
  getBlipCoords,
} = _G;
