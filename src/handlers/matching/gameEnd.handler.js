import { getAllGameSessions, getGame, removeGame } from "../../session/game.session.js";
import { getAllUserSessions, getUser, removeUser } from "../../session/user.session.js";
import { config } from '../../config/config.js';
import { createClient } from "redis";

export const gameEnd = async (socket, payload) => {

    const user = getUser(payload.uuid);
    const gameSession = getGame(user.gameId);

    if (payload.score > payload.highScore) {
        const client = createClient({
            username: config.redis.redisId,
            password: config.redis.redisPassword,
            socket: {
                host: config.redis.redisHost,
                port: config.redis.redisPort,
            }
        });

        await client.connect();

        await client.set(payload.uuid, JSON.stringify({
            highScore: payload.score
        }));

        await client.disconnect();
    }

    const existGameSession = await getGame(user.gameId)

    if (existGameSession) {
        removeGame(user.gameId)
    }

    removeUser(payload.uuid)

    return { status: 'success', message: '게임 종료 완료' }
};