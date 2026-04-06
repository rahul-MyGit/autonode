import { z } from "zod";

export const UserCredentialsSchema = z.object({
    id: z.string(),
    name: z.string(),
    appIcon: z.string(),
    apiName: z.string(),
    application: z.string(),
    type: z.string().nullable().optional(),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    data: z.any()
});

export const PositionSchema = z.object({
    x: z.number(),
    y: z.number()
});

export const NodeDataSchema = z.object({
    label: z.string(),
    actionType: z.string().optional(),
    application: z.string().optional(),
    credentials: UserCredentialsSchema.optional(),
    description: z.string().optional(),
    triggerId: z.string().optional(),
    triggerType: z.string().optional(),
    metadata: z.any().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    parameters: z.any().optional(),
    actionDefination: z.any().optional(),
    cronExpression: z.string().optional(),
    scheduleName: z.string().optional(),
    configured: z.boolean().optional(),
    autoOpen: z.boolean().optional(),
});

export const MeasuredSchema = z.object({
    width: z.number(),
    height: z.number()
});

export const INodeSchema = z.object({
    id: z.string(),
    type: z.string(),
    position: PositionSchema,
    workflowId: z.string().optional(),
    data: NodeDataSchema,
    measured: MeasuredSchema.optional(),
    selected: z.boolean().optional(),
    dragging: z.boolean().optional()
  });

export const IEdgeSchema = z.object({
    workflowId: z.string().optional(),
    id: z.string(),
    source: z.string(),
    target: z.string(),
    animated: z.boolean()
  });

export const workflowSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    active: z.boolean(),
    tags: z.array(z.string()).optional(),
    nodes: z.array(INodeSchema),
    edges: z.array(IEdgeSchema),
});
