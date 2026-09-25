import { z } from 'zod';

import { BRIDGE_PROTOCOL_VERSION, BridgeMessageType, ViewerTool } from './constants';

const rowIdSchema = z.string().min(1);
const annotationIdSchema = z.string().min(1);

export const activateToolPayloadSchema = z.object({
  rowId: rowIdSchema,
  toolName: z.enum([ViewerTool.ELLIPTICAL_ROI, ViewerTool.LENGTH]),
});

export const deactivateToolPayloadSchema = z.object({
  rowId: rowIdSchema,
});

const annotationPayloadSchema = z.object({
  annotationId: annotationIdSchema,
});

export const focusMeasurementPayloadSchema = annotationPayloadSchema;
export const deleteMeasurementPayloadSchema = annotationPayloadSchema;

export const measurementPayloadSchema = z.object({
  rowId: rowIdSchema,
  annotationId: annotationIdSchema,
  toolName: z.enum([ViewerTool.ELLIPTICAL_ROI, ViewerTool.LENGTH]),
  metric: z.object({
    value: z.number(),
    unit: z.string().min(1),
  }),
});

export const measurementRemovedPayloadSchema = z.object({
  rowId: rowIdSchema,
  annotationId: annotationIdSchema,
});

export const hostToViewerMessageSchema = z.discriminatedUnion('type', [
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.REQUEST_VIEWER_READY),
    payload: z.object({}),
  }),
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
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.FOCUS_MEASUREMENT),
    payload: focusMeasurementPayloadSchema,
  }),
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.DELETE_MEASUREMENT),
    payload: deleteMeasurementPayloadSchema,
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
  z.object({
    version: z.literal(BRIDGE_PROTOCOL_VERSION),
    type: z.literal(BridgeMessageType.MEASUREMENT_REMOVED),
    payload: measurementRemovedPayloadSchema,
  }),
]);
