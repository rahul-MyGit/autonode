import { ApiResponse, asyncHandler, CustomError } from "@n8n/auth";
import type { Request, Response } from "express";
import { authService } from "../service/auth.service";
import { generateCookieOptions } from "../config/cookie";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        const userId = await authService.signup(email, password, name);
        res.status(201).json(new ApiResponse(201, "User created successfully", userId));

    } catch (error: any) {
        if (error.message === "User already exists") {
            throw new CustomError(400, error.message);
        }
        throw new CustomError(500, "Failed to create user");
    }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { user, accessToken, refreshToken } = await authService.login(email, password);
        res.status(200).cookie("accessToken", accessToken, generateCookieOptions()).cookie("refreshToken", refreshToken, generateCookieOptions()).json(new ApiResponse(200, "Login successful", user));

    } catch (error: any) {
        throw new CustomError(400, error.message || "Invalid credentials");
    }
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError(401, "UserId not found");

    try {   
        const user = await authService.getUser(userId);
        res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    } catch (error: any) {
        throw new CustomError(400, error.message || "Failed to fetch user");
    }

});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json(new ApiResponse(200, "Logged out successfully", null));
});

export const googleVerify = asyncHandler(async (req: Request, res: Response) => {
    res.send("Google Verify");
});

export const signInWithGoogle = asyncHandler(async (req: Request, res: Response) => {
    res.send("Sign In With Google");
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
    res.send("Google Callback");
});