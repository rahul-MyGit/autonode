import { ApiResponse, asyncHandler, CustomError } from "@n8n/auth";
import type { Request, Response } from "express";
import { authService } from "../service/auth.service";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const {email, password, name} = req.body;

    try {
        
    const userId = await authService.signup(email, password, name);
    res.status(201).json(new ApiResponse(201, "User created successfully", userId));
    } catch (error: any) {
        if(error.message === "User already exists") {
            throw new CustomError(400, error.message);
        }
        throw new CustomError(500, "Failed to create user");
    }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    res.send("Login");
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    res.send("Get User");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.send("Logout");
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