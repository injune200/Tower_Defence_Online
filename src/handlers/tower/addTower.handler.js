import { getAllGameSessions } from "../../session/game.session.js";
import { getUser, getUuidBySocket } from "../../session/user.session.js"

export const addTower = async (socket, payload) => {
    console.log('타워추가 실행됨')
    const userInfo = getUuidBySocket(socket);
    const user = getUser(payload.uuid);

    if (!user) {
        return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
    }

    user.towers.push(payload.tower)

    const gameSession = getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(payload.uuid);

    opponentUser.socket.emit('addTower', { opponentTower: payload.tower })

    return { message: '타워 좌표 전송 완료' }
}