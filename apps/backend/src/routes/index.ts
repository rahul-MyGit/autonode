import authRouter from "./auth.routes";
import workflowRouter from "./workflowRouter";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouter);
router.use("/workflow", workflowRouter);

export default router;