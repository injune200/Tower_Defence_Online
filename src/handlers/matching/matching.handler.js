import { MAX_PLAYERS } from '../../class/model/game.class.js';
import { addGame, getAllGameSessions } from '../../session/game.session.js';
import { addUser } from '../../session/user.session.js';
import { authorization } from '../authorization/authorization.js';
import { gameStartHandler } from './gameStart.handler.js';

export const waitForMatch = async (socket, payload) => {
  const uuid = await authorization(payload);
  socket.emit('uuid', uuid);

  const user = addUser(uuid, socket);
  const game = findGameSession();
  game.addUser(user);

  if (game.users.length === 2) {
    console.log(`Start ${game.gameId}`);

    // start game
    gameStartHandler(game);
    return { status: 'success', message: 'Game Start!' };
  }

  return { status: 'success', message: 'Waiting for user ...' };
};

// 참여할 Game 찾기, 없다면 addGame 후 참여
export const findGameSession = () => {
  const gameSessions = getAllGameSessions();
  for (let game of gameSessions) {
    // game에 참여한 user 수가 MAX_PLAYERS(2)보다 작다면
    if (game.users.length < MAX_PLAYERS) {
      return game;
    }
  }

  // 빈 game이 없다면 new game 만들기
  const newGame = addGame(`Game${gameSessions.length + 1}`);
  console.log(`Create Game: ${newGame.gameId}`);

  return newGame;
};
