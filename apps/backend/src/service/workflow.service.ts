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
            workflowId: savedWorkflow.id,
            name: savedWorkflow.name,
            active: savedWorkflow.active,
            createdAt: savedWorkflow.createdAt,
        };
    }
}

export const workflowService = new WorkflowService();