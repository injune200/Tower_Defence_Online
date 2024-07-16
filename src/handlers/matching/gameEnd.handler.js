import { getGame } from "../../session/game.session.js";

export const gameEnd = (socket, payload) => {

    const gameSession = getGame(user.gameId);
    const opponentUser = gameSession.getOpponentUser(payload.uuid);


    return { message: "gameOver" }
};