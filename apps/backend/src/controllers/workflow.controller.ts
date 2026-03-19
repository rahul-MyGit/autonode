import { ApiResponse, asyncHandler, CustomError } from "@n8n/auth";
import type { Request, Response } from "express";
import { workflowService } from "../service/workflow.service";

export const saveWorkflow = asyncHandler(async (req: Request, res: Response) => {

});

export const getWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) throw new CustomError(401, "User not found");

    try {
        const workflows = await workflowService.getAllUserWorkflows(userId);
        res.status(200).json(new ApiResponse(200, "Workflows fetched successfully", workflows));
    } catch (error: any) {
        throw new CustomError(400, error.message || "Failed to fetch workflows");
    }
});

export const getWorkflowById = asyncHandler(async (req: Request, res: Response) => {

});

export const updateWorkflowById = asyncHandler(async (req: Request, res: Response) => {

});

export const deleteWorkflowById = asyncHandler(async (req: Request, res: Response) => {

});