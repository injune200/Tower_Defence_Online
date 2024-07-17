import { getGame } from "../../session/game.session.js";
import { getUser } from "../../session/user.session.js";

export const baseOver = async (socket, payload) => {

    const user = getUser(payload.uuid);

    const gameSession = await getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(payload.uuid);

    opponentUser.socket.emit('gameOver', { isWin: true })
    user.socket.emit('gameOver', { isWin: false })


    return { status: 'success', message: '게임종료 수신 완료' }
}