import type {
  ActivateToolPayload,
  DeactivateToolPayload,
  DeleteMeasurementPayload,
  FocusMeasurementPayload,
  HostToViewerMessage,
  ViewerToHostMessage,
} from './bridge.types';
import { BRIDGE_PROTOCOL_VERSION, BridgeMessageType } from './constants';
import { viewerToHostMessageSchema } from './schemas';

type ViewerMessageHandler = (message: ViewerToHostMessage) => void;

type ViewerBridgeClientOptions = { viewerOrigin: string };

export class ViewerBridgeClient {
  private readonly viewerOrigin: string;
  private readonly listeners = new Set<ViewerMessageHandler>();
  private queuedMessages: HostToViewerMessage[] = [];
  private viewerWindow: Window | null = null;
  private ready = false;
  private connected = false;

  constructor({ viewerOrigin }: ViewerBridgeClientOptions) {
    this.viewerOrigin = viewerOrigin;
  }

  connect() {
    if (this.connected) return;
    window.addEventListener('message', this.handleMessage);
    this.connected = true;
  }

  disconnect() {
    if (!this.connected) return;
    window.removeEventListener('message', this.handleMessage);
    this.connected = false;
    this.queuedMessages = [];
    this.ready = false;
  }

  setViewerWindow(viewerWindow: Window | null) {
    if (this.viewerWindow === viewerWindow) return;
    this.viewerWindow = viewerWindow;
    this.ready = false;
  }

  activateTool(payload: ActivateToolPayload) {
    this.postToViewer({ version: BRIDGE_PROTOCOL_VERSION, type: BridgeMessageType.ACTIVATE_TOOL, payload });
  }

  deactivateTool(payload: DeactivateToolPayload) {
    this.postToViewer({ version: BRIDGE_PROTOCOL_VERSION, type: BridgeMessageType.DEACTIVATE_TOOL, payload });
  }

  focusMeasurement(payload: FocusMeasurementPayload) {
    this.postToViewer({ version: BRIDGE_PROTOCOL_VERSION, type: BridgeMessageType.FOCUS_MEASUREMENT, payload });
  }

  deleteMeasurement(payload: DeleteMeasurementPayload) {
    this.postToViewer({ version: BRIDGE_PROTOCOL_VERSION, type: BridgeMessageType.DELETE_MEASUREMENT, payload });
  }

  subscribe(handler: ViewerMessageHandler): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  destroy() {
    this.disconnect();
    this.listeners.clear();
    this.viewerWindow = null;
  }

  private readonly handleMessage = (event: MessageEvent) => {
    if (event.origin !== this.viewerOrigin || !this.viewerWindow || event.source !== this.viewerWindow) return;

    const result = viewerToHostMessageSchema.safeParse(event.data);
    if (!result.success) return;

    console.log('[HostBridge] received from viewer', result.data);

    switch (result.data.type) {
      case BridgeMessageType.VIEWER_READY:
        this.ready = true;
        console.log('[HostBridge] viewer ready');
        this.flushQueue();
        break;
    }

    this.listeners.forEach((handler) => handler(result.data));
  };

  private postToViewer(message: HostToViewerMessage) {
    if (!this.ready || !this.viewerWindow) {
      this.queuedMessages.push(message);
      console.log('[HostBridge] queued until viewer ready', message);
      return;
    }

    this.sendToViewer(message);
  }

  private flushQueue() {
    if (!this.viewerWindow) return;

    const queuedMessages = this.queuedMessages.splice(0);
    queuedMessages.forEach(this.sendToViewer);
  }

  private readonly sendToViewer = (message: HostToViewerMessage) => {
    if (!this.viewerWindow) return;

    console.log('[HostBridge] sent to viewer', message);
    this.viewerWindow.postMessage(message, this.viewerOrigin);
  };
}
