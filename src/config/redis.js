const Redis = require("ioredis");

const connectToRedis = () => {
  const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  });

  redisClient.on('connect', () => {
    console.log('🚀🚀🚀 Connected to Redis successfully and ready!');
  });

  redisClient.on('error', (err) => {
    console.error('❌❌❌ Failed to connect to Redis: ', err);
  });

  redisClient.on('end', () => {
    console.log('🚀🚀🚀 Disconnected from Redis!');
  });

  return redisClient;
};

const getKeys = async () => {
  const redisClient = connectToRedis();
  try {
    const keys = await redisClient.keys('*'); // Lấy tất cả các key trong Redis
    console.log('Redis keys:', keys);
    return keys;
  } catch (err) {
    console.error('Error fetching keys from Redis:', err);
    throw err;
  } finally {
    await redisClient.quit(); // Đóng kết nối Redis sau khi hoàn thành
  }
};

module.exports = { connectToRedis, getKeys };
