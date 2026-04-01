//TODO: Implement the engine

import { Worker } from "bullmq";
import { prisma } from "@n8n/db";
import { Workflow } from "./workers/workflow";

const worker = new Worker("workflow-queue", async (job) => {
    const start = Date.now();
    const executionData = job.data;
    try {
        await prisma.workflowExecution.create({
            data: {
                id: executionData.executionJobId,
                workflowId: executionData.workflow.id,
                workflowName: executionData.workflow.name,
                userId: executionData.userId,
                status: "RUNNING",
                triggeredBy: executionData.triggerBy,
                startedAt: new Date(),
                finishedAt: null,
                duration: null,
                error: null,
                nodeResults: [],
                metadata: executionData.metadata || {},
            }
        })

        // TODO: build the whole graph
        // TODO: validate for fail fast if there's cycles
        // TODO: Fetch the order of execution
        // TODO: Execute in Order
        // TODO: Update DB as completed

        const workflowObj = new Workflow(executionData);
        workflowObj.buildGraph();
    } catch (error) {
        
    }
});
