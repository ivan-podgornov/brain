import type { VehicleHandle, PedHandle } from './handles';

/**
 * Интерфейс функций для работы с транспортом в MoonLoader
 */
interface VehicleGlobal {
  /** Создает машину */
  createCar(this: void, modelId: number, x: number, y: number, z: number): VehicleHandle;

  /** Удаляет машину */
  deleteCar(this: void, car: VehicleHandle): void;

  /** Проверяет существование машины */
  doesVehicleExist(this: void, car: VehicleHandle): boolean;

  /** Устанавливает координаты машины */
  setCarCoordinates(this: void, car: VehicleHandle, x: number, y: number, z: number): void;

  /** Получает координаты машины */
  getCarCoordinates(this: void, car: VehicleHandle): LuaMultiReturn<[number, number, number]>;

  /** Устанавливает угол поворота машины */
  setCarHeading(this: void, car: VehicleHandle, angle: number): void;

  /** Получает угол поворота машины */
  getCarHeading(this: void, car: VehicleHandle): number;

  /** Устанавливает здоровье машины */
  setCarHealth(this: void, car: VehicleHandle, health: number): void;

  /** Получает здоровье машины */
  getCarHealth(this: void, car: VehicleHandle): number;

  /** Устанавливает цвета машины */
  changeCarColour(this: void, car: VehicleHandle, color1: number, color2: number): void;

  /** Получает цвета машины */
  getCarColours(this: void, car: VehicleHandle): LuaMultiReturn<[number, number]>;

  /** Взрывает машину */
  explodeCar(this: void, car: VehicleHandle): void;

  /** Чинит машину */
  fixCar(this: void, car: VehicleHandle): void;

  /** Блокирует двери машины */
  lockCarDoors(this: void, car: VehicleHandle, lockStatus: number): void;

  /** Включает сирену */
  switchCarSiren(this: void, car: VehicleHandle, state: boolean): void;

  /** Включает фары */
  forceCarLights(this: void, car: VehicleHandle, state: number): void;

  /** Устанавливает можно ли взорвать машину */
  setCarProofs(
    this: void,
    car: VehicleHandle,
    bullet: boolean,
    fire: boolean,
    explosion: boolean,
    collision: boolean,
    melee: boolean
  ): void;

  /** Получает модель машины */
  getCarModel(this: void, car: VehicleHandle): number;

  /** Получает скорость машины */
  getCarSpeed(this: void, car: VehicleHandle): number;

  /** Устанавливает скорость машины */
  setCarForwardSpeed(this: void, car: VehicleHandle, speed: number): void;

  /** Получает водителя машины */
  getDriverOfCar(this: void, car: VehicleHandle): PedHandle;

  /** Получает количество пассажиров */
  getNumberOfPassengers(this: void, car: VehicleHandle): number;

  /** Получает максимальное количество пассажиров */
  getMaximumNumberOfPassengers(this: void, car: VehicleHandle): number;

  /** Проверяет наличие персонажа в машине */
  isCarPassengerSeatFree(this: void, car: VehicleHandle, seatId: number): boolean;

  /** Получает пассажира на определенном месте */
  getCharInCarPassengerSeat(this: void, car: VehicleHandle, seatId: number): PedHandle;

  /** Замораживает машину */
  freezeCarPosition(this: void, car: VehicleHandle, freeze: boolean): void;

  /** Отмечает машину как более ненужную */
  markCarAsNoLongerNeeded(this: void, car: VehicleHandle): void;

  /** Устанавливает видимость машины */
  setCarVisible(this: void, car: VehicleHandle, visible: boolean): void;

  /** Проверяет, утоплена ли машина */
  isCarInWater(this: void, car: VehicleHandle): boolean;

  /** Проверяет, в воздухе ли машина */
  isCarInAirProper(this: void, car: VehicleHandle): boolean;

  /** Проверяет, перевернута ли машина */
  isCarUpsidedown(this: void, car: VehicleHandle): boolean;

  /** Устанавливает невидимость для радара */
  dontProcessVehicleRecordingsNearNetworkPlayers(
    this: void,
    car: VehicleHandle,
    state: boolean
  ): void;
}

declare const _G: VehicleGlobal;

export const {
  createCar,
  deleteCar,
  doesVehicleExist,
  setCarCoordinates,
  getCarCoordinates,
  setCarHeading,
  getCarHeading,
  setCarHealth,
  getCarHealth,
  changeCarColour,
  getCarColours,
  explodeCar,
  fixCar,
  lockCarDoors,
  switchCarSiren,
  forceCarLights,
  setCarProofs,
  getCarModel,
  getCarSpeed,
  setCarForwardSpeed,
  getDriverOfCar,
  getNumberOfPassengers,
  getMaximumNumberOfPassengers,
  isCarPassengerSeatFree,
  getCharInCarPassengerSeat,
  freezeCarPosition,
  markCarAsNoLongerNeeded,
  setCarVisible,
  isCarInWater,
  isCarInAirProper,
  isCarUpsidedown,
  dontProcessVehicleRecordingsNearNetworkPlayers,
} = _G;
