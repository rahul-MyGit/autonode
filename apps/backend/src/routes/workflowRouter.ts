import { Router } from "express";
import { isProtected } from "../middleware/auth.middleware";
import { saveWorkflow, getWorkflow, getWorkflowById, updateWorkflowById, deleteWorkflowById } from "../controllers/workflow.controller";

const router = Router();

router.post("/save", isProtected, saveWorkflow);
router.get("/", isProtected, getWorkflow);    //DONE
router.get(":/id" , isProtected, getWorkflowById);
router.put(":/id" , isProtected, updateWorkflowById);
router.delete(":/id" , isProtected, deleteWorkflowById);


export default router;