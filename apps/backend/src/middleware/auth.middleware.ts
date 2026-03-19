import type { Request, Response, NextFunction } from "express";
import { CustomError } from "@n8n/auth";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ENV } from "../config/env";
import type { decodedUser } from "../config/express";

export const isProtected = (req: Request, res: Response, next: NextFunction) => {
    const {accessToken} = req.cookies;
    if (!accessToken) throw new CustomError(401, "No Access Token in middleware");

    try {
        const decoded = jwt.verify(accessToken, ENV.JWT_SECRET);
        req.user = decoded as decodedUser;
        next();
    } catch (error) {
        if( error instanceof TokenExpiredError) throw new CustomError(401, error.message);
        throw new CustomError(401, "Invalid or expired token");
    }
}