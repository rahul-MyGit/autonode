import { prisma, type User } from "@n8n/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CONFIG from "@n8n/config";
import ms, { type StringValue } from "ms";
import crypto from "crypto";
export class AuthService {

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }

    generateAccessToken(user: User) {
        return jwt.sign({id: user.id, email: user.email}, CONFIG.AUTH_SECRET.ACCESS_TOKEN_SECRET, {expiresIn: CONFIG.AUTH_SECRET.ACCESS_TOKEN_EXPIRY as StringValue});
    }

    generateRefreshToken(user: User) {
        return jwt.sign({id: user.id, email: user.email}, CONFIG.AUTH_SECRET.REFRESH_TOKEN_SECRET, {expiresIn: CONFIG.AUTH_SECRET.REFRESH_TOKEN_EXPIRY as StringValue});
    }

    createHash(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex");
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

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) {
            throw new Error("User not found");
        }
        const isPasswordCorrect = await this.comparePassword(password, user.password!);
        if(!isPasswordCorrect) {
            throw new Error("Invalid credentials");
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        const hashedRefreshToken = this.createHash(refreshToken);
        const expiresAt = new Date(
            Date.now() + ms(CONFIG.AUTH_SECRET.REFRESH_TOKEN_EXPIRY as StringValue)
        );

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { refreshToken: hashedRefreshToken, refreshTokenExpiry: expiresAt },
          });
      
          return {
            user: updatedUser,
            accessToken,
            refreshToken,
          };
    }
}

export const authService = new AuthService();