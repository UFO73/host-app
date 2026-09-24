import { z } from 'zod';

import { BRIDGE_PROTOCOL_VERSION, BridgeMessageType, ViewerTool } from './constants';

const rowIdSchema = z.string().min(1);
const annotationIdSchema = z.string().min(1);

export const activateToolPayloadSchema = z.object({
  rowId: rowIdSchema,
  toolName: z.literal(ViewerTool.ELLIPTICAL_ROI),
});

export const deactivateToolPayloadSchema = z.object({
  rowId: rowIdSchema,
});

export const measurementPayloadSchema = z.object({
  rowId: rowIdSchema,
  annotationId: annotationIdSchema,
  area: z.object({
    value: z.number(),
    unit: z.string().min(1),
  }),
});

export const hostToViewerMessageSchema = z.discriminatedUnion('type', [
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.ACTIVATE_TOOL),
    payload: activateToolPayloadSchema,
  }),
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.DEACTIVATE_TOOL),
    payload: deactivateToolPayloadSchema,
  }),
]);

export const viewerToHostMessageSchema = z.discriminatedUnion('type', [
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.VIEWER_READY),
    payload: z.object({}),
  }),
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.MEASUREMENT_ADDED),
    payload: measurementPayloadSchema,
  }),
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.MEASUREMENT_UPDATED),
    payload: measurementPayloadSchema,
  }),
]);
