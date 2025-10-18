// Redis client wrapper. Uses REDIS_URL env or localhost fallback.
const redis = require('redis');
const url = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url });

client.on('error', (err) => console.error('Redis Client Error', err));

// connect immediately (top-level async IIFE)
(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connect error', err);
  }
})();

module.exports = client;
