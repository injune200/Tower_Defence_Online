import { getGame } from "../../session/game.session.js";
import { getUser } from "../../session/user.session.js";

export const towerAttackMonster = async (socket, payload) => {
    const user = getUser(payload.uuid);

    if (!user) {
        return { status: 'fail', message: '존재하지 않는 유저 입니다.' };
    }

    const gameSession = await getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(payload.uuid);

    opponentUser.socket.emit('towerAttackMonster', { towerIndex: payload.towerIndex, monsterIndex: payload.monsterIndex })

    return { status: 'success', message: '타워 몬스터 공격 데이터 전송 완료' };
}