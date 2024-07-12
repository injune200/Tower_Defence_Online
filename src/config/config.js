import { REDISHOST, REDISID, REDISPASSWORD, REDISPORT } from '../constatns/env.js';
import { PORT, HOST, SECRETKEY } from '../constatns/env.js';

export const config = {
  redis: {
    redisPort: REDISPORT,
    redisHost: REDISHOST,
    redisId: REDISID,
    redisPassword: REDISPASSWORD,
  },
  server: {
    port: PORT,
    host: HOST,
    secretKey: SECRETKEY,
  },
};
