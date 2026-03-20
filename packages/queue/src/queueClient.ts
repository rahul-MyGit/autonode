import { redisConfig } from "@n8n/redis";
import {Queue} from "bullmq";


export function createQueue(name: string){
    const redisConf = redisConfig();

    return new Queue(name, {
        connection: {
          host: redisConf.host,
          port: redisConf.port,
        },
      });
}

export const workflowQueue = createQueue("workflow-queue");
