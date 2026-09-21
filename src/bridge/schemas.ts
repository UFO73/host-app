import { z } from 'zod';

import { BRIDGE_EVENT_TYPES, BRIDGE_PROTOCOL_VERSION } from './constants';

export const bridgeMessageSchema = z.object({
  version: z.literal(BRIDGE_PROTOCOL_VERSION),
  type: z.enum(BRIDGE_EVENT_TYPES),
  payload: z.unknown(),
});
