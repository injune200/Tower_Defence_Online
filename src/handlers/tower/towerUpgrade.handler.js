import { getGame } from "../../session/game.session.js";
import { getUser } from "../../session/user.session.js"


export const towerUpgrade = async (socket, payload) => {
    const user = getUser(payload.uuid);

    if (!user) {
        return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
    }

    const gameSession = getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(payload.uuid);

    opponentUser.socket.emit('towerUpgrade', {
        towerIndex: payload.towerIndex,
    });

    return { status: 'success', message: '타워 업그레이드 데이터 전송 완료' };
};
