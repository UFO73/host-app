import type { Dispatch } from '@reduxjs/toolkit';
import type { ViewerBridgeClient } from '../bridge/bridgeListeners';
import { ViewerTool, type MeasurementPayload } from '../bridge/contract';
import {
  measurementAddedReceived,
  measurementCancelled,
  measurementDeleted,
  measurementDrawingStarted,
  measurementUpdatedReceived,
} from './slices/measurementsSlice';

type MeasurementFlowOptions = {
  bridge: ViewerBridgeClient;
  dispatch: Dispatch;
};

export class MeasurementFlow {
  constructor(private readonly options: MeasurementFlowOptions) {}

  activate(rowId: string) {
    this.options.dispatch(measurementDrawingStarted({ rowId }));
    this.options.bridge.activateTool({ rowId, toolName: ViewerTool.ELLIPTICAL_ROI });
  }

  cancel(rowId: string) {
    this.options.bridge.deactivateTool({ rowId });
    this.options.dispatch(measurementCancelled({ rowId }));
  }

  focus(annotationId: string) {
    this.options.bridge.focusMeasurement({ annotationId });
  }

  delete(rowId: string, annotationId: string) {
    this.options.bridge.deleteMeasurement({ annotationId });
    this.options.dispatch(measurementDeleted({ rowId }));
  }

  handleMeasurementAdded(payload: MeasurementPayload) {
    this.options.dispatch(measurementAddedReceived(payload));
  }

  handleMeasurementUpdated(payload: MeasurementPayload) {
    this.options.dispatch(measurementUpdatedReceived(payload));
  }
}
