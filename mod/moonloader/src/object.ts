import type { ObjectHandle, PedHandle, VehicleHandle } from './handles';

/**
 * Интерфейс функций для работы с объектами в MoonLoader
 */
interface ObjectGlobal {
  /** Создает объект */
  createObject(this: void, modelId: number, x: number, y: number, z: number): ObjectHandle;

  /** Создает объект без смещения */
  createObjectNoOffset(this: void, modelId: number, x: number, y: number, z: number): ObjectHandle;

  /** Удаляет объект */
  deleteObject(this: void, obj: ObjectHandle): void;

  /** Проверяет существование объекта */
  doesObjectExist(this: void, obj: ObjectHandle): boolean;

  /** Устанавливает координаты объекта */
  setObjectCoordinates(this: void, obj: ObjectHandle, x: number, y: number, z: number): void;

  /** Получает координаты объекта */
  getObjectCoordinates(this: void, obj: ObjectHandle): LuaMultiReturn<[number, number, number]>;

  /** Устанавливает угол поворота объекта */
  setObjectHeading(this: void, obj: ObjectHandle, angle: number): void;

  /** Получает угол поворота объекта */
  getObjectHeading(this: void, obj: ObjectHandle): number;

  /** Прикрепляет объект к машине */
  attachObjectToCar(
    this: void,
    obj: ObjectHandle,
    car: VehicleHandle,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    rotX: number,
    rotY: number,
    rotZ: number
  ): void;

  /** Прикрепляет объект к персонажу */
  attachObjectToChar(
    this: void,
    obj: ObjectHandle,
    ped: PedHandle,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    rotX: number,
    rotY: number,
    rotZ: number
  ): void;

  /** Отсоединяет объект */
  detachObject(
    this: void,
    obj: ObjectHandle,
    x: number,
    y: number,
    z: number,
    collision: boolean
  ): void;

  /** Устанавливает видимость объекта */
  setObjectVisible(this: void, obj: ObjectHandle, visible: boolean): void;

  /** Делает объект разрушаемым */
  setObjectDynamic(this: void, obj: ObjectHandle, state: boolean): void;

  /** Устанавливает невосприимчивость объекта к повреждениям */
  setObjectProofs(
    this: void,
    obj: ObjectHandle,
    bullet: boolean,
    fire: boolean,
    explosion: boolean,
    collision: boolean,
    melee: boolean
  ): void;

  /** Замораживает объект */
  freezeObjectPosition(this: void, obj: ObjectHandle, freeze: boolean): void;
}

declare const _G: ObjectGlobal;

export const {
  createObject,
  createObjectNoOffset,
  deleteObject,
  doesObjectExist,
  setObjectCoordinates,
  getObjectCoordinates,
  setObjectHeading,
  getObjectHeading,
  attachObjectToCar,
  attachObjectToChar,
  detachObject,
  setObjectVisible,
  setObjectDynamic,
  setObjectProofs,
  freezeObjectPosition,
} = _G;
