import handlerMappings from './handlerMapping.js';
import jwt from 'jsonwebtoken';
export const handleDisconnect = (socket) => {};

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

  const response = await handler(socket, data.payload);

  if (response.broadcast !== undefined) {
    io.emit('response', response);
    return;
  }

  socket.emit('response', response);
};
