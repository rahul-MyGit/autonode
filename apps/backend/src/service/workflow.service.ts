import { prisma } from "@n8n/db";
import { workflowSchema } from "@n8n/zod";

export class WorkflowService {

    async getAllUserWorkflows(userId: number) {
        const workflows = await prisma.workflow.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
        return workflows;
    }

    async saveWorkflow(userId: number, workflowData: any) {
        const validatedWorkflow = workflowSchema.parse(workflowData);

        const savedWorkflow = await prisma.workflow.create({
            data: {
              name: validatedWorkflow.name,
              description: validatedWorkflow.description,
              active: validatedWorkflow.active,
              nodes: validatedWorkflow.nodes,
              edges: validatedWorkflow.edges,
              userId,
              tags: [],
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
        const workflow = await prisma.workflow.findUnique({ where: { id: workflowId, userId } });
        if(!workflow) throw new Error("Workflow not found");
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
}

export const workflowService = new WorkflowService();