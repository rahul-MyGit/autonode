import type { NodeData, WorkflowExecutionData } from "@n8n/zod";
import { EventPublisher } from "../services/eventPublisher";
import { prisma } from "@n8n/db";

export class Workflow {
    private executionData: WorkflowExecutionData;
    private nodes : Map<string, NodeData>;
    private adjacenctList : Map<string, string[]>;
    private indegree : Map<string,number>;
    private eventPublisher =  new EventPublisher();

    private actionExecutor: any; //TODO: Implement the action executor
    private nodeOutputs: Map<string, any>;

    constructor(executionData: WorkflowExecutionData){
        this.executionData = executionData;
        this.nodes = new Map<string, NodeData>();
        this.adjacenctList = new Map<string, string[]>();
        this.indegree = new Map<string, number>();

        this.actionExecutor = new ActionExecutor(); //TODO: Implement the action executor
        this.nodeOutputs = new Map();
    }

    buildGraph() {
        this.executionData.workflow.nodes.map((node) => {
            this.nodes.set(node.id, node);
            this.indegree.set(node.id, 0);
            this.adjacenctList.set(node.id, []);
        })

        this.executionData.workflow.edges.map((edge) => {
            this.adjacenctList.get(edge.source)?.push(edge.target);
            this.indegree.set(edge.target, (this.indegree.get(edge.target) || 0) + 1);
        })
    }

    checkForCycles() {
        const temporaryCopyOfDegree = new Map<string, number>(this.indegree);
        const queue: string[] = [];
        const processsed: string[] = [];

        for ( const [node, degree] of temporaryCopyOfDegree){
            if (degree === 0) {
                queue.push(node);
            }
        }

        while (queue.length > 0) {
            const current = queue.shift()!;
            processsed.push(current);

            for ( let neighbor of this.adjacenctList.get(current) ?? []) {
                temporaryCopyOfDegree.set(neighbor, (temporaryCopyOfDegree.get(neighbor) ?? 0) - 1);
                if (temporaryCopyOfDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }

            return processsed.length !== this.nodes.size;
        }
    }

    fetchExecutionOrder() {
        const temporaryCopyOfDegree = new Map<string, number>(this.indegree);
        const queue: string[] = [];
        const orderOfExecution: string[] = [];

        for ( let [node, degree] of temporaryCopyOfDegree){
            if (degree === 0) {
                queue.push(node);
            }
        }

        while (queue.length > 0) {
            const currentNodeId = queue.shift()!;
            orderOfExecution.push(currentNodeId);

            for ( let neighbor of this.adjacenctList.get(currentNodeId) ?? []) {
                temporaryCopyOfDegree.set(neighbor, (temporaryCopyOfDegree.get(neighbor) ?? 0) - 1);
                if (temporaryCopyOfDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }

        if (orderOfExecution.length !== this.nodes.size) {
            console.log("Cycle detected");
          }
          return orderOfExecution;
    }



    async executeNode(nodeId: string): Promise<void> {
        const node = this.nodes.get(nodeId);

        if (!node) {
            console.log("Node not found");
            return;
        }
        if(this.checkForCycles()){
            this.eventPublisher.publish("workflow.event", {
                executionId: this.executionData.executionJobId,
                workflowId: this.executionData.workflow.id,
                workflowName: this.executionData.workflow.name,
                userId: this.executionData.userId,
                nodeId: node.id,
                timeStamp: new Date(Date.now()),
                status: "failed"
            })
        }

        console.log("Executing node", nodeId + " And the Type is " + node.type);

        this.eventPublisher.publish("workflow.event", {
            executionId: this.executionData.executionJobId,
            workflowId: this.executionData.workflow.id,
            workflowName: this.executionData.workflow.name,
            userId: this.executionData.userId,
            nodeId: node.id,
            timeStamp: new Date(Date.now()),
            status: "started",
        });

        try {
            let output: any = null;

            if(node.type === "manualtrigger"){
                console.log("Manual trigger executed");

            output = {
                triggeredBy: "manual",
                timestamp: new Date().toISOString(),
                executionId: this.executionData.executionJobId,
            };

            this.nodeOutputs.set(nodeId, output);

            } else if (node.type === "webhooktrigger"){
                const triggerData = this.executionData.triggerData;
                console.log("Trigger data", triggerData);

                output = {
                    webhookPayload: triggerData?.webhookPayload,
                    payload: triggerData?.webhookPayload,
                    triggerSource: triggerData?.ip,
                    method: triggerData?.method,
                    queryParams: triggerData?.queryParams,
                    headers: triggerData?.headers,
                    timestamp: new Date().toISOString(),
                };

                this.nodeOutputs.set(nodeId, output);
            } else if (node.type === "scheduletrigger"){
                console.log("Schedule trigger executed");

                const metadata = this.executionData.metadata;

                const output = {
                    triggeredBy: "schedule",
                    timestamp: new Date().toISOString(),
                    executionId: this.executionData.executionJobId,
                    scheduledTime: metadata?.scheduledTime,
                    nodeId: metadata?.nodeId,
                };

                this.nodeOutputs.set(nodeId, output);
            } else if (node.type === "action"){
                if(!this.actionExecutor){
                    await this.loadcredentials();
                }
                const previousOutputs = Object.fromEntries(this.nodeOutputs);

                const parentEdges = this.executionData.workflow.edges.filter((edge) => edge.target === nodeId);

                if(parentEdges.length > 0){
                    const parentNodeId = parentEdges[0]!.source;
                    const parentOutput = this.nodeOutputs.get(parentNodeId);

                    if(parentOutput){
                        previousOutputs.previousNode = parentOutput;
                        console.log("Previous outputs", previousOutputs);
                    }
                }

                console.log("Current Node:" + nodeId + " " + node.data.actionType);
                console.log("got data from previous node");

                if(Object.keys(previousOutputs).length === 0){
                    console.log("No previous node output found");
                }else{
                    for ( const [nodeId, nodeOutput] of Object.entries(previousOutputs)){
                        console.log("Node ID:" + nodeId + " " + nodeOutput);
                        if(nodeOutput && typeof nodeOutput === "object"){
                            const keys = Object.keys(nodeOutput);

                            if('content' in nodeOutput){
                                const preview = String(output.content).substring(0, 100);
                                console.log(`content : ${preview}${String(nodeOutput.content).length > 100 ? "..." : ""}`);
                            }
                        }
                    }
                }
                
                console.log(`Executing action: ${node.data.actionType}`);

                output = await this.actionExecutor.executeAction(node, previousOutputs);
                this.nodeOutputs.set(nodeId, output);

                console.log("\nAction completed successfully");
                console.log(" Output stored for node:", nodeId);

                console.log(`Action ${node.data.actionType} completed:`, output);
            } else {
                //unknown
                console.log(`Unknown node type: ${node.type}`);
                output = {
                    error: `Unknown node type: ${node.type}`,
                    timestamp: new Date().toISOString(),
                };
            }

            this.eventPublisher.publish("workflow.event", {
                executionId: this.executionData.executionJobId,
                workflowId: this.executionData.workflow.id,
                workflowName: this.executionData.workflow.name,
                userId: this.executionData.userId,
                nodeId: node.id,
                timeStamp: new Date(Date.now()),
                status: "completed",
                data: output,
            });
        } catch (error) {
            console.error(`Error executing node ${nodeId}:`, error);

            const errorOutput = {
                error: (error as Error).message,
                timestamp: new Date().toISOString(),
                nodeId: nodeId,
            };

            this.nodeOutputs.set(nodeId, errorOutput);

            this.eventPublisher.publish("workflow.event", {
                executionId: this.executionData.executionJobId,
                workflowId: this.executionData.workflow.id,
                workflowName: this.executionData.workflow.name,
                userId: this.executionData.userId,
                nodeId: nodeId,
                timeStamp: new Date(Date.now()),
                status: "failed",
                data: errorOutput
            });

            throw error;
        }
    }

    async loadcredentials(){
        try {
            console.log("Fetching the credentials for user");

            const cred = await prisma.credentails.findMany({
                where : {
                    userId : this.executionData.userId,
                }
            })

            console.log("Credentials fetched", cred);

            const userCredMap = new Map()
            cred.forEach((cred) => {
                userCredMap.set(cred.application , cred);
            })

            this.actionExecutor.setCredentials(userCredMap); //TODO: Implement the action executor
            
        } catch (error) {
            console.error("Failed to load credentials:", error);
        }

    }

    async executeInOrder(){
        this.buildGraph()

        if(this.checkForCycles()){
            console.log("CYCLE DETECTED IN EXECUTEINORDER");
            return;
        }

        this.eventPublisher.publish("execute-workflow", {
            executionJobId : this.executionData.executionJobId,
            workflowId : this.executionData.workflowId,
            userId : this.executionData.userId,
            trigger: this.executionData.triggerBy,
            nodeId : "workflow",
            timestamp : new Date(Date.now()),
            status: "started"
        })

        await this.loadcredentials();
        const executionOrder = this.fetchExecutionOrder();
        console.log("Execution order", executionOrder);

        let hasError = false;
        for (let nodeId of executionOrder) {
          try {
            await this.executeNode(nodeId);
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error) {
            hasError = true;
            console.error(`Workflow execution stopped at node ${nodeId}:`, error);
            break;
          }
        }

        this.eventPublisher.publish("workflow.event", {
            executionId: this.executionData.executionJobId,
            workflowId: this.executionData.workflow.id,
            workflowName: this.executionData.workflow.name,
            userId: this.executionData.userId,
            nodeId: "workflow",
            timeStamp: new Date(Date.now()),
            status: hasError ? "failed" : "completed",
          });
    }
}