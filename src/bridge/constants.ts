export const BRIDGE_PROTOCOL_VERSION = 1 as const;

export const BRIDGE_EVENT_TYPES = ['VIEWER_READY', 'ACTIVATE_TOOL', 'DEACTIVATE_TOOL', 'MEASUREMENT_ADDED', 'MEASUREMENT_UPDATED'] as const;

export type BridgeEventType = (typeof BRIDGE_EVENT_TYPES)[number];
