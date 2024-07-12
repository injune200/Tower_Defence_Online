import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const REDIS_PORT = process.env.REDISPORT;
export const REDIS_HOST = process.env.REDISHOST;
export const REDIS_ID = process.env.REDISID;
export const REDIS_PASSWORD = process.env.REDISPASSWORD;
export const JWT_SECRET_KEY = process.env.SECRETKEY;
export const CLIENT_VERSION = process.env.CLIENT_VERSION;
