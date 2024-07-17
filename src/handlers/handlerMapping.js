import { gameEnd } from './matching/gameEnd.handler.js';
import { waitForMatch } from './matching/matching.handler.js';
import { addTower } from './tower/addTower.handler.js';
import { responseMonster, removeMonster } from './monster/monster.handler.js';
import { towerAttackMonster } from './tower/towerAttackMonster.js';
import { userDataUpdate } from './user/userDataUpdate.handler.js';
import { baseOver } from './base/baseOver.handler.js';
import { writeChat } from './chat/chat.handler.js';
import { baseAttacked } from './base/base.handler.js';
import { levelUp } from './level/levelUp.handler.js';
import { spawnSpecialMonster } from './monster/spawnSpecialMonster.handler.js';
import { towerRemoved } from './tower/towerRemoved.handler.js';
import { towerUpgrade } from './tower/towerUpgrade.handler.js';

const handlerMappings = {
  0: waitForMatch,
  5: responseMonster,
  6: removeMonster,
  7: writeChat,
  10: userDataUpdate,
  11: levelUp,
  33: baseAttacked,
  44: towerRemoved,
  55: spawnSpecialMonster,
  66: addTower,
  67: towerUpgrade,
  77: towerAttackMonster,
  98: baseOver,
  99: gameEnd,
};

export default handlerMappings;
