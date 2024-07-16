import { getGame } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';

export const levelUp = async (socket, payload) => {
  const user = getUser(payload.uuid);
  if (!user) {
    return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
  }

  if (user.monsterLevel + 1 !== payload.monsterLevel) {
    return { status: 'fail', message: 'Level 증가값이 정상적이지 않습니다.' };
  }
  user.monsterLevel = payload.monsterLevel;

  const gameSession = getGame(user.gameId);
  const opponentUser = gameSession.getOpponentUser(payload.uuid);

  opponentUser.socket.emit('opponentUserLevelUp', { opponentMonsterLevel: user.monsterLevel });

  return { status: 'success', message: 'Level Up 정보 전송 완료' };
};
