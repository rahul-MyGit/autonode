import type { NodeData, WorkflowExecutionData } from "@n8n/zod";
import { EventPublisher } from "../services/eventPublisher";
import { prisma } from "@n8n/db";

export class Workflow {
    private executionData: WorkflowExecutionData;
    private nodes : Map<string, NodeData>;
    private adjacenctList : Map<string, string[]>;
    private indegree : Map<string,number>;
    private eventPublisher =  new EventPublisher();

    constructor(executionData: WorkflowExecutionData){
        this.executionData = executionData;
        this.nodes = new Map<string, NodeData>();
        this.adjacenctList = new Map<string, string[]>();
        this.indegree = new Map<string, number>();
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
        //TODO: publish into the workflow queue
        //TODO: figure out how it got trigger and publist it + execute it accordingly
        //TODO: update the db with the node result
        //TODO: return it
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
                userCredMap.set(cred.ApiName, cred.data);
            })
            
        } catch (error) {
            
        }

    }

    executeInOrder(){
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

        //TODO: load credentials
        //TODO: fetch execution order



    }
}