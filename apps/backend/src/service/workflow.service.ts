import { prisma } from "@n8n/db";

export class WorkflowService {

    async getAllUserWorkflows(userId: number) {
        const workflows = await prisma.workflow.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
        return workflows;
    }
}

export const workflowService = new WorkflowService();