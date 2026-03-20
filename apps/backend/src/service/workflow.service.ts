import { prisma } from "@n8n/db";
import { workflowSchema } from "@n8n/zod";

export class WorkflowService {

    async getAllUserWorkflows(userId: number) {
        const workflows = await prisma.workflow.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: "desc" } });
        return workflows;
    }

    async saveWorkflow(userId: number, workflowData: any) {
        const validatedWorkflow = workflowSchema.parse(workflowData);

        const savedWorkflow = await prisma.workflow.create({
            data: {
                userId,
                name: validatedWorkflow.name,
                description: validatedWorkflow.description,
                active: validatedWorkflow.active,
                tags: validatedWorkflow.tags || [],
                nodes: validatedWorkflow.nodes,
                edges: validatedWorkflow.edges,
            },
        });

        //TODO: refresh the cron

        return {
            id: savedWorkflow.id,
            name: savedWorkflow.name,
            description: savedWorkflow.description,
            active: savedWorkflow.active,
            createdAt: savedWorkflow.createdAt,
        };
    }

    async getWorkflowById(workflowId: number, userId: number) {
        const workflow = await prisma.workflow.findUnique({ where: { id: workflowId, userId, deletedAt: null } });
        if (!workflow) throw new Error("Workflow not found");
        return {
            id: workflow.id,
            name: workflow.name,
            description: workflow.description,
            active: workflow.active,
            nodes: workflow.nodes,
            edges: workflow.edges,
            tags: workflow.tags,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
        };
    }

    async updateWorkflowById(workflowId: number, userId: number, workflowData: any) {
        const validatedWorkflow = workflowSchema.parse(workflowData);

        const updatedWorkflow = await prisma.workflow.update({
            where: { id: workflowId, userId, deletedAt: null },
            data: validatedWorkflow,
        });

        //TODO: refresh the cron

        return {
            id: updatedWorkflow.id,
            name: updatedWorkflow.name,
            description: updatedWorkflow.description,
            active: updatedWorkflow.active,
            createdAt: updatedWorkflow.createdAt,
        }
    }

    async deleteWorkflowById(workflowId: number, userId: number) {
        const deletedWorkflow = await prisma.workflow.update({
            where: { id: workflowId, userId },
            data: { deletedAt: new Date(), active: false },
        });
        if (!deletedWorkflow) throw new Error("Workflow not found");
        return {
            id: deletedWorkflow.id,
            name: deletedWorkflow.name,
            description: deletedWorkflow.description,
            active: deletedWorkflow.active,
            createdAt: deletedWorkflow.createdAt,
            updatedAt: deletedWorkflow.updatedAt,
            deletedAt: deletedWorkflow.deletedAt
        }
    }
}

export const workflowService = new WorkflowService();