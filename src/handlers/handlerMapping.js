import { waitForMatch } from './matching/matching.handler.js';
import { addTower } from './tower/addTower.handler.js'
import { responseMonster, removeMonster } from './monster/monster.handler.js';
import { towerAttackMonster } from './tower/towerAttackMonster.js';

const handlerMappings = {
  0: waitForMatch,
  5: responseMonster,
  6: removeMonster,
  66: addTower,
  77: towerAttackMonster

};

export default handlerMappings;