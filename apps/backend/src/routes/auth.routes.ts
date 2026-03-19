import { Router } from "express";
import { login, signup, getUser, logout, googleVerify, signInWithGoogle, googleCallback } from "../controllers/auth.controllers";
import { isProtected } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", isProtected, getUser);
router.post("/logout", logout);
router.post("/google-verify", googleVerify);
router.get("/google", isProtected, signInWithGoogle);
router.get("/google/callback", isProtected, googleCallback);

export default router;