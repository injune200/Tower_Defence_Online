import { createClient } from 'redis';

const client = createClient({
    username: 'default', // use your Redis user. More info https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/
    password: '1234', // use your password here
    socket: {
        host: '3.22.236.177',
        port: 6379,
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const value = await client.get('foo');
console.log(value) // returns 'bar'

await client.disconnect();