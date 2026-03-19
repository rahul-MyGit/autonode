import { prisma } from "@n8n/db";
import bcrypt from "bcryptjs";
export class AuthService {

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }
    async signup(email: string, password: string, name: string) {
        const user = await prisma.user.findUnique({where: {email}});
        if(user) {
            throw new Error("User Already exist")
        }
        const hashedPassword = await this.hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })
        return newUser.id;
    }
}

export const authService = new AuthService();