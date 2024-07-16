import { getGame } from '../../session/game.session.js';
import { getUser } from '../../session/user.session.js';

export const writeChat = (socket, payload) => {
  const { uuid, message } = payload;

  const user = getUser(uuid);

  if (!user)
    return { status: 'fail', message: '존재하지 않는 유저 또는 유효하지 않은 요청입니다.' };

  if (!message.trim()) return { status: 'fail', message: '메세지가 유효하지 않습니다.' };

  if (!user.gameId) return { status: 'fail', message: '게임에 참가중인 유저가 아닙니다.' };

  const gameSession = getGame(user.gameId);
  if (!gameSession)
    return { status: 'fail', message: `서버내의 해당 게임 id가 없습니다. : ${user.gameId}` };
  try {
    user.socket.emit('chatContents', { uuid: uuid, message: message });

    const opponentUser = gameSession.getOpponentUser(uuid);
    opponentUser.socket.emit('chatContents', { uuid: uuid, message: message });
  } catch (err) {
    console.log(err);
    return { status: 'fail', message: '서버 내의 오류 발생' };
  }

  return { status: 'success', message: message };
};
