import { getUser } from '../../session/user.session.js';

getUser;

export const responseMonster = (uuid, payload, socket) => {
  const { monsterPath, monsterLevel, monsterNumber } = paload.monsterData;

  const user = getUser(uuid);
  if (!user)
    return { status: 'fail', message: '존재하지 않는 유저 또는 유효하지 않은 요청입니다.' };

  if (user.monsterPath !== monsterPath)
    return { status: 'fail', message: '잘못된 monsterPath 입니다.' };

  if (user.monsterLevel !== monsterLevel)
    return { status: 'fail', message: '현재 존재할 수 없는 몬스터 요청입니다.' };

  socket.emit();
};
