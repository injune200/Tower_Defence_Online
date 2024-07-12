import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import cookieParser from 'cookie-parser';
import loginHandler from './handlers/account/login.handler.js';
import registerHandler from './handlers/account/register.handler.js';
import { config } from './config/config.js';

const app = express();
const server = createServer(app);
const PORT = config.server.port;

const io = initSocket(server); // initSocket에서 반환된 io 객체를 받아옴

//json 파싱
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('tower_defense_client_online'));

app.use('/', [registerHandler, loginHandler]);

server.listen(PORT, async () => {
    //서버 실행 코드
    console.log(`포트 ${PORT} 서버가 실행되었습니다`);
});
