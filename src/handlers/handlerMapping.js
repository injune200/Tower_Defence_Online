import { waitForMatch } from './matching/matching.handler.js';
import { addTower } from './tower/addTower.handler.js'
import { responseMonster, removeMonser } from './monster/monser.handler.js';

const handlerMappings = {
  0: waitForMatch,
  5: responseMonster,
  6: removeMonser,
  66: addTower
};

export default handlerMappings;