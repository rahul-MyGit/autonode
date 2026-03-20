import CONFIG from "@n8n/config";
import { createClient, RedisClientType} from "redis";

export function createRedisClient(): RedisClientType {
    const redisConf = redisConfig();
    return createClient({ url: redisConf.url });
}

export async function connectToRedis(client: RedisClientType): Promise<void> {
    if (!client.isOpen) { await client.connect(); }
}
  
export async function disconnectToRedis(client: RedisClientType): Promise<void> {
    if (client.isOpen) { await client.quit(); }
}


export function redisConfig() {
    return {
        url : CONFIG.REDIS.URL,
        host: CONFIG.REDIS.HOST,
        port: CONFIG.REDIS.PORT,
    }
}
