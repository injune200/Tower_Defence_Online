import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const connectHandler = (io) => {
  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    handleConnection(socket);

    socket.on('event', (data) => {
      handlerEvent(io, socket, data);
    });

    socket.on('disconnect', (socket) => {
      //해제하기 까지 대기하는
      handleDisconnect(socket);
    });
  });
};

export default connectHandler;
