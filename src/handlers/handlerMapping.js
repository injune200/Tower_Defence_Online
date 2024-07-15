import { waitForMatch } from './matching/matching.handler.js';
import { responseMonster, removeMontser } from './monster/monster.handler.js';

const handlerMappings = {
  0: waitForMatch,
  5: responseMonster,
  6: removeMontser,
};

export default handlerMappings;
