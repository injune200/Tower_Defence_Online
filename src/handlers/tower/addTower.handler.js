import { getUuidBySocket } from "../../session/user.session.js"

export const addTower = async (socket, payload) => {
    console.log('타워추가 실행됨')
    const userInfo = getUuidBySocket(socket);

    return { x: payload.x, y: payload.y }
}