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

const READY_REQUEST_INTERVAL_MS = 500;

export class ViewerBridgeClient {
  private readonly viewerOrigin: string;
  private readonly listeners = new Set<ViewerMessageHandler>();
  private queuedMessages: HostToViewerMessage[] = [];
  private viewerWindow: Window | null = null;
  private readyRequestTimer: number | null = null;
  private ready = false;
  private connected = false;

  constructor({ viewerOrigin }: ViewerBridgeClientOptions) {
    this.viewerOrigin = viewerOrigin;
  }

  connect() {
    if (this.connected) return;
    window.addEventListener('message', this.handleMessage);
    this.connected = true;
    this.startReadyRequests();
  }

  disconnect() {
    if (this.connected) {
      window.removeEventListener('message', this.handleMessage);
    }
    this.stopReadyRequests();
    this.connected = false;
    this.queuedMessages = [];
    this.ready = false;
  }

  setViewerWindow(viewerWindow: Window | null) {
    this.viewerWindow = viewerWindow;
    this.ready = false;
    this.startReadyRequests();
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
        this.stopReadyRequests();
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

  private startReadyRequests() {
    this.stopReadyRequests();
    if (!this.connected || !this.viewerWindow) return;

    this.requestViewerReady();
    this.readyRequestTimer = window.setInterval(this.requestViewerReady, READY_REQUEST_INTERVAL_MS);
  }

  private stopReadyRequests() {
    if (this.readyRequestTimer === null) return;
    window.clearInterval(this.readyRequestTimer);
    this.readyRequestTimer = null;
  }

  private readonly requestViewerReady = () => {
    this.viewerWindow?.postMessage(
      {
        version: BRIDGE_PROTOCOL_VERSION,
        type: BridgeMessageType.REQUEST_VIEWER_READY,
        payload: {},
      },
      this.viewerOrigin,
    );
  };

  private readonly sendToViewer = (message: HostToViewerMessage) => {
    if (!this.viewerWindow) return;

    console.log('[HostBridge] sent to viewer', message);
    this.viewerWindow.postMessage(message, this.viewerOrigin);
  };
}
