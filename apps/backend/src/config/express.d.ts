import type { User } from "@n8n/db";

export type decodedUser = Pick<User, "id" | "email" | "name">;

declare global {
    namespace Express {
        interface Request {
            user?: decodedUser;
        }
    }
}

export {};