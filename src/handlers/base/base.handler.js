import { getGame } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';

export const baseAttackedHandler = (socket, payload) => {
  const user = getUser(payload.uuid);
  if (!user) {
    return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
  }

  user.baseHp -= payload.attackedPower;

  if (user.baseHp !== payload.baseHp) {
    return { status: 'fail', message: 'server와 baseHp가 다릅니다.' };
  }

  const gameSession = getGame(user.gameId);
  const opponentUser = gameSession.getOpponentUser(payload.uuid);

  opponentUser.socket.emit('opponentBaseAttacked', { opponentBaseHp: user.baseHp });

  return { status: 'success', message: '기지 HP 전송 완료' };
};
