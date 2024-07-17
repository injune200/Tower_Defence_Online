import { getUser } from '../../session/user.session.js';
import { getGame } from '../../session/game.session.js';

export const responseMonster = async (socket, payload) => {
  const { uuid } = payload;
  const { path, level } = payload.monsterData;

  const user = getUser(uuid);
  const gameSession = getGame(user.gameId);
  const opponentUser = gameSession.getOpponentUser(uuid);

  if (!user)
    return { status: 'fail', message: '존재하지 않는 유저 또는 유효하지 않은 요청입니다.' };

  if (user.monsterPath[0].x !== path[0].x || user.monsterPath[0].y !== path[0].y)
    return { status: 'fail', message: '잘못된 monsterPath 입니다.' };

  if (opponentUser.monsterLevel != level)
    return { status: 'fail', message: '현재 존재할 수 없는 몬스터 요청입니다.' };

  user.monsters.push(payload.monsterData);

  try {
    opponentUser.socket.emit('createOpponentMonster', { payload: payload.monsterData });
  } catch (err) {
    console.log(err);
    return { status: 'fail', message: `서버 내의 오류 발생` };
  }

  return { status: 'success', message: '몬스터 생성 완료' };
};

export const removeMonster = (socket, payload) => {
  const { uuid } = payload;
  const monsterIndex = payload.monsterIndex;
  const user = getUser(uuid);

  if (!user)
    return { status: 'fail', message: '존재하지 않는 유저 또는 유효하지 않은 요청입니다.' };

  user.monsters.splice(monsterIndex, 1);
  try {
    const gameSession = getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(uuid);
    opponentUser.socket.emit('removeOpponentMonster', { monsterIndex });
  } catch (err) {
    console.log(err);
    return { status: 'fail', message: `서버 내의 오류 발생` };
  }

  return { status: 'success', message: '몬스터 삭제 완료' };
};
