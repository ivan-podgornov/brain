import type { PedHandle, VehicleHandle } from './handles';

/**
 * Интерфейс функций для работы с персонажами в MoonLoader
 */
interface CharGlobal {
  /** Создает персонажа в заданных координатах с указанной моделью и поведением пешехода */
  createChar(
    this: void,
    pedType: number,
    modelId: number,
    x: number,
    y: number,
    z: number
  ): PedHandle;

  /** Создает персонажа в транспорте */
  createCharInsideCar(this: void, car: VehicleHandle, pedType: number, modelId: number): PedHandle;

  /** Создает персонажа как пассажира */
  createCharAsPassenger(
    this: void,
    car: VehicleHandle,
    pedType: number,
    modelId: number,
    seatId: number
  ): PedHandle;

  /** Удаляет персонажа из игры */
  deleteChar(this: void, ped: PedHandle): void;

  /** Проверяет существование персонажа */
  doesCharExist(this: void, ped: PedHandle): boolean;

  /** Устанавливает угол поворота персонажа */
  setCharHeading(this: void, ped: PedHandle, angle: number): void;

  /** Получает угол поворота персонажа */
  getCharHeading(this: void, ped: PedHandle): number;

  /** Получает координаты персонажа */
  getCharCoordinates(this: void, ped: PedHandle): LuaMultiReturn<[number, number, number]>;

  /** Устанавливает координаты персонажа */
  setCharCoordinates(this: void, ped: PedHandle, x: number, y: number, z: number): void;

  /** Указывает игре, что персонажа нельзя удалять */
  dontRemoveChar(this: void, ped: PedHandle): void;

  /** Устанавливает персонажу колизию */
  setLoadCollisionForCharFlag(this: void, ped: PedHandle, enable: boolean): void;

  /** Проверяет смерть персонажа */
  isCharDead(this: void, ped: PedHandle): boolean;

  /** Проверяет, жив ли персонаж */
  isCharPlayingAnim(this: void, ped: PedHandle, animName: string): boolean;

  /** Устанавливает здоровье персонажу */
  setCharHealth(this: void, ped: PedHandle, health: number): void;

  /**
   * Устанавливает персонажу колизию
   * @param ped - персонаж, для которого нужно установить колизию
   * @param collision - true для включения колизии, false для отключения
   */
  setCharCollision(this: void, ped: PedHandle, collision: boolean): void;

  /**
   * Делает персонажа неуязвимым для атак других NPC.
   * Персонаж не будет автоматически выбираться в качестве цели
   * @param ped - персонаж, которого нельзя атаковать
   * @param untargetable - true чтобы сделать персонажа неуязвимым для таргетинга
   */
  setCharNeverTargetted(this: void, ped: PedHandle, untargetable: boolean): void;

  /** Получает здоровье персонажа */
  getCharHealth(this: void, ped: PedHandle): number;

  /** Устанавливает броню персонажу */
  setCharArmour(this: void, ped: PedHandle, armour: number): void;

  /** Получает броню персонажа */
  getCharArmour(this: void, ped: PedHandle): number;

  /** Дает персонажу оружие */
  giveWeaponToChar(this: void, ped: PedHandle, weaponId: number, ammo: number): void;

  /** Удаляет оружие у персонажа */
  removeWeaponFromChar(this: void, ped: PedHandle, weaponId: number): void;

  /** Устанавливает текущее оружие персонажа */
  setCurrentCharWeapon(this: void, ped: PedHandle, weaponId: number): void;

  /** Получает текущее оружие персонажа */
  getCurrentCharWeapon(this: void, ped: PedHandle): number;

  /** Устанавливает точность стрельбы персонажа */
  setCharAccuracy(this: void, ped: PedHandle, accuracy: number): void;

  /** Установить игнорирование высоты при поиске пути */
  ignoreHeightDifferenceFollowingNodes(this: void, ped: PedHandle, ignore: boolean): void;

  /** Заставляет персонажа повернуться таким образом, чтоб смотреть в сторону angle */
  taskAchieveHeading(this: void, ped: PedHandle, angle: number): void;

  /** Заставляет персонажа сесть в машину в качестве водителя */
  taskEnterCarAsDriver(this: void, ped: PedHandle, car: VehicleHandle, timeout: number): void;

  /** Заставляет персонажа сесть в машину в качестве пассажира */
  taskEnterCarAsPassenger(
    this: void,
    ped: PedHandle,
    car: VehicleHandle,
    timeout: number,
    seatId: number
  ): void;

  /** Заставляет персонажа покинуть транспорт */
  taskLeaveAnyCar(this: void, ped: PedHandle): void;

  /** Заставляет персонажа идти к координатам */
  taskGoToCoordAnyMeans(
    this: void,
    ped: PedHandle,
    x: number,
    y: number,
    z: number,
    mode: number,
    radius: number
  ): void;

  /** Заставляет персонажа идти к координатам */
  taskGoStraightToCoord(
    this: void,
    ped: PedHandle,
    x: number,
    y: number,
    z: number,
    mode: number,
    timeout: number
  ): void;

  /** Заставляет персонажа бежать к указанному персонажу */
  taskGotoChar(
    this: void,
    ped: PedHandle,
    targetPed: PedHandle,
    timelimit: number,
    stopWithinRadius: number
  ): void;

  /** Заставляет персонажа идти к указанному персонажу */
  taskGotoCharAiming(
    this: void,
    ped: PedHandle,
    targetPed: PedHandle,
    minRadius: number,
    maxRadius: number
  ): void;

  /** Заставляет персонажа идти к указанному персонажу */
  taskGotoCharOffset(
    this: void,
    ped: PedHandle,
    targetPed: PedHandle,
    timelimit: number,
    approachDistance: number,
    approachAngle: number
  ): void;

  /** Заставляет персонажа следовать за целью */
  taskFollowPathNodesToCoord(
    this: void,
    ped: PedHandle,
    x: number,
    y: number,
    z: number,
    mode: number,
    timeout: number
  ): void;

  /** Проиграть анимацию */
  taskPlayAnim(
    this: void,
    ped: PedHandle,
    animName: string,
    ifpName: string,
    speed: number,
    loop: boolean,
    lockX: boolean,
    lockY: boolean,
    lockF: boolean,
    time: number
  ): void;

  /** Остановить анимацию */
  taskDie(this: void, ped: PedHandle): void;

  /** Заставляет персонажа бродить */
  taskWanderStandard(this: void, ped: PedHandle): void;

  /** Заставляет персонажа атаковать */
  taskCombat(this: void, ped: PedHandle, targetPed: PedHandle): void;

  /** Очищает задачи персонажа */
  clearCharTasks(this: void, ped: PedHandle): void;

  /** Очищает задачи персонажа немедленно */
  clearCharTasksImmediately(this: void, ped: PedHandle): void;

  /** Проверяет, сидит ли персонаж в каком-либо транспорте */
  isCharInAnyCar(this: void, ped: PedHandle): boolean;

  /** Проверяет, сидит ли персонаж в конкретном транспорте */
  isCharInCar(this: void, ped: PedHandle, car: VehicleHandle): boolean;

  /** Проверяет, находится ли персонаж в области */
  isCharInArea2d(
    this: void,
    ped: PedHandle,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    sphere: boolean
  ): boolean;

  /** Проверяет, находится ли персонаж в области 3D */
  isCharInArea3d(
    this: void,
    ped: PedHandle,
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    sphere: boolean
  ): boolean;

  /** Получает транспорт, в котором находится персонаж */
  getCarCharIsUsing(this: void, ped: PedHandle): VehicleHandle;

  /** Ищет случайного персонажа в заданных координатах в пределах указанного радиуса */
  findAllRandomCharsInSphere(
    this: void,
    x: number,
    y: number,
    z: number,
    radius: number,
    findNext: boolean,
    skipDead: boolean
  ): LuaMultiReturn<[boolean, PedHandle?]>;

  /** Устанавливает видимость персонажа */
  setCharVisible(this: void, ped: PedHandle, visible: boolean): void;

  /** Устанавливает деньги персонажу */
  setCharMoney(this: void, ped: PedHandle, money: number): void;

  /** Замораживает персонажа */
  freezeCharPosition(this: void, ped: PedHandle, freeze: boolean): void;

  /**
   * Устанавливает иммунитет персонажу
   * true включить иммунитет, false выключить
   */
  setCharProofs(
    this: void,
    ped: PedHandle,
    bullet: boolean,
    fire: boolean,
    explosion: boolean,
    collision: boolean,
    melee: boolean
  ): void;

  /** Устанавливает можно ли сбивать персонажа с ног */
  setCharCanBeKnockedOffBike(this: void, ped: PedHandle, state: boolean): void;

  /** Устанавливает можно ли вытащить персонажа из машины */
  setCharCanBeDraggedOut(this: void, ped: PedHandle, state: boolean): void;

  /** Устанавливает можно ли застрелить персонажа в машине */
  setCharCanBeShotInVehicle(this: void, ped: PedHandle, state: boolean): void;

  /** Возвращает скорость персонажа */
  getCharSpeed(this: void, ped: PedHandle): number;

  /** Устанавливает максимальное здоровье */
  setCharMaxHealth(this: void, ped: PedHandle, health: number): void;
}

declare const _G: CharGlobal;

export const {
  createChar,
  createCharInsideCar,
  createCharAsPassenger,
  deleteChar,
  doesCharExist,
  setCharHeading,
  getCharHeading,
  getCharCoordinates,
  setCharCoordinates,
  dontRemoveChar,
  setLoadCollisionForCharFlag,
  isCharDead,
  isCharPlayingAnim,
  setCharHealth,
  setCharCollision,
  setCharNeverTargetted,
  getCharHealth,
  setCharArmour,
  getCharArmour,
  giveWeaponToChar,
  removeWeaponFromChar,
  setCurrentCharWeapon,
  getCurrentCharWeapon,
  setCharAccuracy,
  ignoreHeightDifferenceFollowingNodes,
  taskAchieveHeading,
  taskEnterCarAsDriver,
  taskEnterCarAsPassenger,
  taskLeaveAnyCar,
  taskGoToCoordAnyMeans,
  taskGoStraightToCoord,
  taskGotoChar,
  taskGotoCharAiming,
  taskGotoCharOffset,
  taskFollowPathNodesToCoord,
  taskPlayAnim,
  taskDie,
  taskWanderStandard,
  taskCombat,
  clearCharTasks,
  clearCharTasksImmediately,
  isCharInAnyCar,
  isCharInCar,
  isCharInArea2d,
  isCharInArea3d,
  getCarCharIsUsing,
  findAllRandomCharsInSphere,
  setCharVisible,
  setCharMoney,
  freezeCharPosition,
  setCharProofs,
  setCharCanBeKnockedOffBike,
  setCharCanBeDraggedOut,
  setCharCanBeShotInVehicle,
  getCharSpeed,
  setCharMaxHealth,
} = _G;
