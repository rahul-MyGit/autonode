import { prisma } from "@n8n/db";
import { workflowQueue } from "@n8n/queue";
import { workflowSchema } from "@n8n/zod";
import { v4 as uuidv4 } from 'uuid';

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

    async executeWorkflow(workflowId: number, userId: number, metadata: any) {
        const workflow = await this.getWorkflowById(workflowId, userId);

        let executionJobId = uuidv4();
        let executionJobData = {
            executionJobId,
            userId,
            triggerBy: "manual",
            triggerAt: new Date().toISOString(),
            status: "QUEUED",
            priority: "NORMAL",
            workflow : {
                id: workflow.id,
                name: workflow.name,
                nodes: workflow.nodes,
                edges: workflow.edges,
                active: workflow.active,
            },
            metadata,
        }

        await workflowQueue.add("execute-workflow", executionJobData, {
            jobId: executionJobId,
            removeOnComplete: 1000,
            removeOnFail: 5000,
        });

        //TODO: push to redis

        return {
            executionJobId,
            id: workflow.id,
            status: executionJobData.status,
            priority: executionJobData.priority,
        }
    }
}

export const workflowService = new WorkflowService();