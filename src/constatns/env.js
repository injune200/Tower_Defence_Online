import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const REDISPORT = process.env.REDISPORT;
export const REDISHOST = process.env.REDISHOST;
export const REDISID = process.env.REDISID;
export const REDISPASSWORD = process.env.REDISPASSWORD;
export const SECRET_KEY = process.env.SECRET_KEY;
