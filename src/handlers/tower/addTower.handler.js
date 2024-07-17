import { getGame } from "../../session/game.session.js";
import { getUser } from "../../session/user.session.js"

export const addTower = async (socket, payload) => {
    const user = getUser(payload.uuid);

    if (!user) {
        return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
    }

    user.towers.push(payload.tower)
    user.userGold = payload.userGold;

    const gameSession = await getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(payload.uuid);

    opponentUser.socket.emit('addTower', { opponentTower: payload.tower })

    return { status: 'success', message: '타워 좌표 전송 완료' }
}