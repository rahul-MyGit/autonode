import CONFIG from "@n8n/config";

export function redisConfig() {

    return {
        url : CONFIG.REDIS.URL,
        host: CONFIG.REDIS.HOST,
        port: Number(CONFIG.REDIS.PORT),
    }
}