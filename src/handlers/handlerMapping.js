import { gameEnd } from './matching/gameEnd.handler.js';
import { waitForMatch } from './matching/matching.handler.js';

const handlerMappings = {
  0: waitForMatch,
  99: gameEnd
};

export default handlerMappings;
