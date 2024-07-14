import { getUser } from '../../session/user.session.js';
import { getGame } from '../../session/game.session.js';

export const responseMonster = (socket, payload) => {
  const { uuid } = payload;
  const { monsterPath, monsterLevel, monsterNumber } = payload.monsterData;

  const user = getUser(uuid);
  if (!user)
    return { status: 'fail', message: '존재하지 않는 유저 또는 유효하지 않은 요청입니다.' };

  if (user.monsterPath !== monsterPath)
    return { status: 'fail', message: '잘못된 monsterPath 입니다.' };

  if (user.monsterLevel !== monsterLevel)
    return { status: 'fail', message: '현재 존재할 수 없는 몬스터 요청입니다.' };

  user.monsters.push(payload.monsterData); //서버 데이터 업데이트

  //상대방에게도 알리는 전달 코드
  try {
    const gameSession = getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(uuid);
    opponentUser.socket.emit('createOpponent', { payload: payload.monsterData });
  } catch (err) {
    console.log(err);
    return { status: 'fail', message: `서버 내의 오류 발생` };
  }

  return { status: 'success', message: '몬스터 생성 완료' };
};

export const removeMonser = (socket, payload) => {
  const { uuid } = payload;
  const { monsterNumber, hp, level, creationTime } = payload.monsterData;
  const user = getUser(uuid);

  if (!user)
    return { status: 'fail', message: '존재하지 않는 유저 또는 유효하지 않은 요청입니다.' };

  const isExistMonster = null;
  for (let monster of user.monsters) {
    if (
      monsterNumber == monster.monsterNumber &&
      level == monster.level &&
      creationTime == monster.creationTime
    ) {
      isExistMonster = true;
    }
  }

  if (isExistMonster) {
    for (let i = 0; i < user.monsters.length; i++) {
      if (user.monsters[i] == isExistMonster) {
        user.monsters.splice(i, 1);
        try {
          const opponentUser = gameSession.getOpponentUser(uuid);
          opponentUser.socket.emit('removeOpponent', { payload: payload.monsterData });
        } catch (err) {
          console.log(err);
          return { status: 'fail', message: `서버 내의 오류 발생` };
        }

        return { status: 'success', message: '몬스터 삭제 완료' };
      }
    }
  }

  return { status: 'fail', message: '존재하지 않는 몬스터 기록입니다.' };
};
