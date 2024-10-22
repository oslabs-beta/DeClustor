const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', async () => {
    console.log('Connected to Redis');
    try {
      await client.flushAll();
      console.log('Redis database flushed');
    } catch (err) {
      console.error('Error flushing Redis database:', err);
    }
  });

client.connect().catch(console.error);

module.exports = client;



