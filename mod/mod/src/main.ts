import './patch-global';

import { GtaGame } from '@brain/gta-sa';
import { getCharCoordinates, print, wait, wasKeyPressed, PLAYER_PED } from '@brain/moonloader';
import { World } from '@brain/world';

import { VK_G, VK_H } from 'vkeys';

function main() {
  while (true) {
    wait(40);

    if (wasKeyPressed(VK_G)) {
      const [x, y, z] = getCharCoordinates(PLAYER_PED);
      print(`x: ${x}, y: ${y}, z: ${z}`);
    }

    if (wasKeyPressed(VK_H)) {
      new World({ game: new GtaGame() }).bigBang();
    }
  }
}

// @ts-expect-error -- так того требует moonloader
globalThis.main = main;
