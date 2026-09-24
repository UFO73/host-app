import type { z } from 'zod';

import type {
  activateToolPayloadSchema,
  deactivateToolPayloadSchema,
  deleteMeasurementPayloadSchema,
  focusMeasurementPayloadSchema,
  hostToViewerMessageSchema,
  measurementPayloadSchema,
  viewerToHostMessageSchema,
} from './schemas';

export type HostToViewerMessage = z.infer<typeof hostToViewerMessageSchema>;
export type ViewerToHostMessage = z.infer<typeof viewerToHostMessageSchema>;
export type ActivateToolPayload = z.infer<typeof activateToolPayloadSchema>;
export type DeactivateToolPayload = z.infer<typeof deactivateToolPayloadSchema>;
export type DeleteMeasurementPayload = z.infer<typeof deleteMeasurementPayloadSchema>;
export type FocusMeasurementPayload = z.infer<typeof focusMeasurementPayloadSchema>;
export type MeasurementPayload = z.infer<typeof measurementPayloadSchema>;
