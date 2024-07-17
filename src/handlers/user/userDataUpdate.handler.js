import { getUser } from "../../session/user.session.js";

export const userDataUpdate = (socket, payload) => {
    const user = getUser(payload.uuid);
    user.userGold = payload.userGold
    user.score = payload.score

    return { status: 'success', message: '유저 정보 업데이트 완료.' };
}