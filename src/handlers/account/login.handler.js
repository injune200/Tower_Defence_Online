import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createClient } from 'redis';
import express from 'express';
import { config } from '../../config/config.js';

// / 로그인 API /
const router = express.Router();

const loginHandler = router.post('/login', async (req, res, io) => {
  const { username, password } = req.body;

  try {
    const client = createClient({
      username: config.redis.redisId,
      password: config.redis.redisPassword,
      socket: {
        host: config.redis.redisHost,
        port: config.redis.redisPort,
      },
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    const user = await client.get(username);

    await client.disconnect();
    const userData = JSON.parse(user);
    if (!user) return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
    else if (!(await bcrypt.compare(password, userData.password))) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign(
      {
        type: 'JWT',
        uuid: userData.uuid,
      },
      config.auth.secretKey,
      {
        expiresIn: '60m',
      },
    );

    console.log('로그인 성공\nuserData:', user);
    res.setHeader('authorization', `Bearer ${token}`);

    return res.status(200).json({ message: '로그인 성공', data: username });
  } catch (error) {
    console.error('로그인에 오류 발생!', error);
    return res.status(500).json('Server Error: 500');
  }
});

export default loginHandler;
