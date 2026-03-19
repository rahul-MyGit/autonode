import type { Request, Response } from "express";

export const signupController = (req: Request, res: Response) => {
    res.send("Signup");
}

export const loginController = (req: Request, res: Response) => {
    res.send("Login");
}