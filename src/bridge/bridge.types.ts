import type { BRIDGE_PROTOCOL_VERSION, BridgeEventType } from './constants';

export type BridgeMessage<TType extends BridgeEventType = BridgeEventType, TPayload = unknown> = {
  version: typeof BRIDGE_PROTOCOL_VERSION;
  type: TType;
  payload: TPayload;
};
