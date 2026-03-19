import { prisma } from "@n8n/db";
export class AuthService {
    async signup(email: string, password: string, name: string) {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name
            }
        })
        return 12
    }
}

export const authService = new AuthService();