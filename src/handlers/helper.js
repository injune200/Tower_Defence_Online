import handlerMappings from './handlerMapping.js';
import jwt from 'jsonwebtoken';
export const handleDisconnect = (socket) => { };

export const handleConnection = (socket) => {
  console.log('서버 연결 완료');

  socket.emit('connection', { message: '연결 완료' });
};

export const handlerEvent = async (io, socket, data) => {

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }
  //검증 미들웨어 하드코딩
  try {
    let uuid;
    if (data.handlerId === 2) {
      const authorization = data.payload.token;
      if (!authorization) throw new Error('토큰이 존재하지 않습니다.');
      const [tokenType, token] = authorization.split('%20');
      if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');
      uuid = await jwt.verify(token, process.env.JWT_SECRET_KEY).user_id;
      socket.emit('uuid', uuid);
    } else {
      uuid = await data.userId;
    }
    const response = await handler(uuid, data.payload);

    if (response.broadcast !== undefined) {
      io.emit('response', response);
      return;
    }

    socket.emit('response', response);
  } catch (e) {
    console.log(e);
    return e;
  }
};
