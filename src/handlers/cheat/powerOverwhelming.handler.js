import { getGame } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';

export const powerOverwhelming = async (socket, payload) => {
  const user = getUser(payload.uuid);

  if (!user) {
    return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
  }

  const gameSession = getGame(user.gameId);
  const opponentUser = gameSession.getOpponentUser(payload.uuid);

  opponentUser.socket.emit('powerOverwhelming', {});

  return { status: 'success', message: 'Cheat 전송 완료' };
};
