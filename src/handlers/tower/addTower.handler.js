import { getAllGameSessions } from "../../session/game.session.js";
import { getUuidBySocket } from "../../session/user.session.js"

export const addTower = async (socket, payload) => {
    console.log('타워추가 실행됨')
    const userInfo = getUuidBySocket(socket);

    const gameSessions = getAllGameSessions();
    let opponentSocket;

    for (let element of gameSessions) { //상대방 소켓 정보 가져오기
        if (element.users[0].uuid == payload.uuid) {
            opponentSocket = element.users[1].socket
        } else if (element.users[1].uuid == payload.uuid) {
            opponentSocket = element.users[0].socket
        }
    }
    opponentSocket.emit('addTower', { x: payload.x, y: payload.y })

    return { message: '타워 좌표 전송 완료' }
}