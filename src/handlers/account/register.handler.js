import express from "express";
import { createClient } from "redis";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { config } from '../../config/config.js';

const router = express.Router();

const registerHandler = router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const uuid = uuidv4();

    try {

        const client = createClient({
            username: config.redis.redisId,
            password: config.redis.redisPassword,
            socket: {
                host: config.redis.redisHost,
                port: config.redis.redisPort,
            }
        });

        await client.connect();

        const existUser = await client.get(username);

        if (existUser) {//존재 여부 검사
            return res.status(400).json({ message: "이미존재하는 사용자 입니다." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.set(username, JSON.stringify({
            password: hashedPassword,
            uuid
        }));

        await client.set(uuid, JSON.stringify({
            highScore: 0
        }));

        await client.disconnect();

        res.status(201).json({
            message: '유저가 생성되었습니다'
        });

    } catch (error) {
        console.log('회원 가입중 에러 발생', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
});

export default registerHandler;
