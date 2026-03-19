import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export type { User } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});

async function connectPrismaClient() {
    try {
        await prisma.$connect()
    } catch (error) {
        console.log("PRISMA CLIENT COULD NOT CONNECT", error)
    }
}

connectPrismaClient();
