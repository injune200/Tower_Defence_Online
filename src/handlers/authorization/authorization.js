import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';

export const authorization = async (payload) => {
  try {
    const authorization = payload.token;
    if (!authorization) throw new Error('토큰이 존재하지 않습니다.');
    const [tokenType, token] = authorization.split(' ');
    console.log(tokenType);
    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');
    const uuid = await jwt.verify(token, config.auth.secretKey).uuid;
    // socket.emit('uuid', uuid);
    console.log(`token authorization success\nuuid: ${uuid}`);
    return uuid;
  } catch (err) {
    console.error(err);
  }
};
