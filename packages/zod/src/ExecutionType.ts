export enum ExecutionStatus {
    QUEUED = "queued",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

export enum Priority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
}

type ExecutionMetadata = {
    source: string;
    userAgent: string;
    ip: string;
    scheduledTime?: string;
    nodeId?: string;
};

export type NodeData = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
      label?: string;
      triggerId?: string;
      triggerType?: string;
      description?: string;
  
      name?: string;
      application?: string;
      actionType?: string;
      credentials?: Record<string, any>;
      parameters?: Record<string, any>;
      metadata?: Record<string, any>;
    };
};
  
export type EdgeData = {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
};

export type WorkflowDefinition = {
    id: string;
    name: string;
    active: boolean;
    nodes: NodeData[];
    edges: EdgeData[];
};

export type WorkflowExecutionData = {
    executionJobId: string;
    workflowId: number;
    userId: number;
    triggerBy: "manual" | "api" | "schedule" | "webhook" | "email";
    triggerAt: string;
    status: ExecutionStatus;
    priority: Priority;
    maxRetries?: number;
    timeout?: number;
    metadata?: ExecutionMetadata;
    //TODO: Add trigger data
    workflow: WorkflowDefinition;
};