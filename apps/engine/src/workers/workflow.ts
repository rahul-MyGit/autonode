import type { NodeData, WorkflowExecutionData } from "@n8n/zod";
export class Workflow {
    private executionData: WorkflowExecutionData;
    private nodes : Map<string, NodeData>;
    private adjacenctList : Map<string, string[]>;
    private indegree : Map<string,number>;

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

    }

    executeInOrder() {

    }
}