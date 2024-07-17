import { getGame } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';

export const towerRemoved = async (socket, payload) => {
  const user = getUser(payload.uuid);
  if (!user) {
    return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
  }

  const gameSession = getGame(user.gameId);
  const opponentUser = gameSession.getOpponentUser(payload.uuid);

  user.towers.splice(payload.towerIndex, 1);

  opponentUser.socket.emit('towerRemoved', {
    towerIndex: payload.towerIndex,
    monsterIndex: payload.monsterIndex,
  });

  return { status: 'success', message: '타워 삭제 정보 전송 완료' };
};
