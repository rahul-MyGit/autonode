import { asyncHandler } from "@n8n/auth";
import type { Request, Response } from "express";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    res.send("Signup");
})

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