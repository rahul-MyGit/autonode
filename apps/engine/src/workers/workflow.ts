import type { WorkflowExecutionData } from "@n8n/zod";
export class Workflow {
    private executionData: WorkflowExecutionData;

    constructor(executionData: WorkflowExecutionData){
        this.executionData = executionData;
    }

    buildGraph() {

    }

    checkForCycles() {

    }

    fetchExecutionOrder() {

    }

    executeInOrder() {

    }
}