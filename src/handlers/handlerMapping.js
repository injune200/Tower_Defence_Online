import { gameEnd } from './matching/gameEnd.handler.js';
import { waitForMatch } from './matching/matching.handler.js';
import { addTower } from './tower/addTower.handler.js';
import { responseMonster, removeMonster } from './monster/monster.handler.js';
import { towerAttackMonster } from './tower/towerAttackMonster.js';
import { baseAttackedHandler } from './base/base.handler.js';
import { userDataUpdate } from './user/userDataUpdate.handler.js';
import { baseOver } from './base/baseOver.handler.js';

const handlerMappings = {
  0: waitForMatch,
  5: responseMonster,
  6: removeMonster,
  10: userDataUpdate,
  33: baseAttackedHandler,
  66: addTower,
  77: towerAttackMonster,
  98: baseOver,
  99: gameEnd
};

export default handlerMappings;
