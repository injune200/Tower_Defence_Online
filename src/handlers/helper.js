import { getUuidBySocket } from '../session/user.session.js';
import handlerMappings from './handlerMapping.js';
export const handleDisconnect = (socket) => {
  const uuid = getUuidBySocket(socket);
  console.log(`클라이언트 연결 해제`);
};

export const handleConnection = (socket) => {
  console.log('클라이언트 연결 완료');

  socket.emit('connection', { status: 'success', message: '연결 완료' });
};

export const handlerEvent = async (io, socket, data) => {
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = await handler(socket, data.payload);

  // socket.broadcast.emit()

  // if (response.broadcast !== undefined) {
  //   io.emit('response', response);
  //   return;
  // }

  socket.emit('response', response);
};
