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
    const gameSessions = getAllGameSessions();
    let opponentSocket;

    for (let element of gameSessions) { //상대방 소켓 정보 가져오기
        if (element.users[0].uuid == payload.uuid) {
            opponentSocket = element.users[1].socket
        } else if (element.users[1].uuid == payload.uuid) {
            opponentSocket = element.users[0].socket
        }
    }
    opponentSocket.emit('addTower', { opponentTower: payload.tower })

    return { message: '타워 좌표 전송 완료' }
}