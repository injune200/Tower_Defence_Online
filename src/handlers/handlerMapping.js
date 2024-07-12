import { waitForMatch } from './matching/matching.handler.js';
import { addTower } from './tower/addTower.handler.js'

const handlerMappings = {
  0: waitForMatch,
  66: addTower
};

export default handlerMappings;