import {
  CLIENT_VERSION,
  JWT_SECRET_KEY,
  REDIS_HOST,
  REDIS_ID,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '../constants/env.js';
import { PORT, HOST } from '../constants/env.js';

export const config = {
  redis: {
    redisPort: REDIS_PORT,
    redisHost: REDIS_HOST,
    redisId: REDIS_ID,
    redisPassword: REDIS_PASSWORD,
  },
  client: {
    version: CLIENT_VERSION,
  },
  server: {
    port: PORT,
    host: HOST,
  },
  auth: {
    secretKey: JWT_SECRET_KEY,
  },
};
