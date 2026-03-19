import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import CONFIG from "@n8n/config";

export type { User } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: CONFIG.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});

async function connectPrismaClient() {
    try {
        await prisma.$connect()
        console.log("CONNECTED TO DATABASE")
    } catch (error) {
        console.log("PRISMA CLIENT COULD NOT CONNECT", error)
    }
}

connectPrismaClient();
