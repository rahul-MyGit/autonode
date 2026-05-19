import { createRedisClient } from "@n8n/redis"

export class EventPublisher {
    private client;

    constructor(){
        this.client = createRedisClient();
        this.client.connect();
    }

    async publish(channel: string, event: any){
        this.client.publish(channel, JSON.stringify(event))
    }
}