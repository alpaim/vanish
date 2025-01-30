import { Redis } from "ioredis";

const globalForRedis = global as unknown as {
    redis: Redis | undefined;
};

export const redis =
    globalForRedis.redis ??
    new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || "1"),
        retryStrategy: (times: number) => {
            return Math.min(times * 50, 2000);
        },
    });

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}