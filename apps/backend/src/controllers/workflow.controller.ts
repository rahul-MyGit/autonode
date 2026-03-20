import { ApiResponse, asyncHandler, CustomError } from "@n8n/auth";
import type { Request, Response } from "express";
import { workflowService } from "../service/workflow.service";

export const saveWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError(401, "User not found");

    try {
        const workflow = await workflowService.saveWorkflow(userId, req.body);
        res.status(200).json(new ApiResponse(200, "Workflow saved successfully", workflow));
    } catch (error: any) {
        throw new CustomError(500, error.message || "Failed to save workflow");
    }
});

export const getWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError(401, "User not found");

    try {
        const workflows = await workflowService.getAllUserWorkflows(userId);
        res.status(200).json(new ApiResponse(200, "Workflows fetched successfully", workflows));
    } catch (error: any) {
        throw new CustomError(400, error.message || "Failed to fetch workflows");
    }
});

export const getWorkflowById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError(401, "User not found");

    const { id } = req.params;
    if (!id || isNaN(Number(id))) throw new CustomError(400, "Invalid workflow ID");
    const workflowId = Number(id);

    try {
        const workflow = await workflowService.getWorkflowById(workflowId, userId);
        if (!workflow) throw new CustomError(404, "Workflow not found");

        res.status(200).json(new ApiResponse(200, "Workflow fetched successfully", workflow));
    } catch (error: any) {
        throw new CustomError(500, error.message || "Failed to fetch workflow");
    }
});

export const updateWorkflowById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError(401, "User not found");

    const { id } = req.params;
    if (!id || isNaN(Number(id))) throw new CustomError(400, "Invalid workflow ID");
    const workflowId = Number(id);

    try {
        const updatedWorkflow = await workflowService.updateWorkflowById(workflowId, userId, req.body);
        res.status(200).json(new ApiResponse(200, "Workflow updated successfully", updatedWorkflow));
    } catch (error: any) {
        if (error.code === "P2025") {
            return res
                .status(404)
                .json(new ApiResponse(404, "Workflow not found", null));
        }
        throw new CustomError(500, error.message || "Failed to update workflow");
    }
});

export const deleteWorkflowById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) throw new CustomError(401, "User not found");

    const {id} = req.params;
    if(!id || isNaN(Number(id))) throw new CustomError(400, "Invalid workflow ID");
    const workflowId = Number(id);

    try {
        const deletedWorkflow = await workflowService.deleteWorkflowById(workflowId, userId);
        res.status(200).json(new ApiResponse(200, "Workflow deleted successfully", deletedWorkflow));
    } catch (error: any) {
        throw new CustomError(500, error.message || "Failed to delete workflow");
    }
});

export const executeWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) throw new CustomError(401, "User not found");

    const {id} = req.params;
    if(!id || isNaN(Number(id))) throw new CustomError(400, "Invalid workflow ID");
    const workflowId = Number(id);

    let metadata = {
        source: "api",
        timestamp: new Date().toISOString(),  //TODO: Later put at trace
    }

    try {
        const executedWorkflow = await workflowService.executeWorkflow(workflowId, userId, metadata);
        res.status(200).json(new ApiResponse(200, "Workflow executed successfully", executedWorkflow));
    } catch (error: any) {
        throw new CustomError(500, error.message || "Failed to execute workflow");
    }
})