import { createAction, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ViewerTool, type ViewerToolName } from '../../bridge/contract';

export type MeasurementMetric = { value: number; unit: string };

export type Measurement =
  | { status: 'waiting'; rowId: string; toolName: ViewerToolName }
  | { status: 'drawing'; rowId: string; toolName: ViewerToolName }
  | {
      status: 'completed';
      rowId: string;
      annotationId: string;
      toolName: ViewerToolName;
      metric: MeasurementMetric;
    };

export type MeasurementResult = {
  rowId: string;
  annotationId: string;
  toolName: ViewerToolName;
  metric: MeasurementMetric;
};

export type MeasurementsState = { rows: Measurement[] };
const initialState: MeasurementsState = { rows: [] };

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementAddedRequested: {
      reducer(state, action: PayloadAction<{ rowId: string; toolName: ViewerToolName }>) {
        state.rows.push({ status: 'waiting', ...action.payload });
      },
      prepare(toolName: ViewerToolName) {
        return { payload: { rowId: crypto.randomUUID(), toolName } };
      },
    },
    measurementDrawingStarted(state, action: PayloadAction<{ rowId: string }>) {
      state.rows = state.rows.map((row) => {
        if (row.rowId === action.payload.rowId && row.status === 'waiting') {
          return { status: 'drawing', rowId: row.rowId, toolName: row.toolName };
        }

        if (row.status === 'drawing') {
          return { status: 'waiting', rowId: row.rowId, toolName: row.toolName };
        }

        return row;
      });
    },
    measurementCancelled(state, action: PayloadAction<{ rowId: string }>) {
      state.rows = state.rows.filter((row) => row.rowId !== action.payload.rowId || row.status !== 'drawing');
    },
    measurementAddedReceived(state, action: PayloadAction<MeasurementResult>) {
      state.rows = state.rows.map((row) => (row.rowId === action.payload.rowId && row.status === 'drawing' ? { status: 'completed', ...action.payload } : row));
    },
    measurementUpdatedReceived(state, action: PayloadAction<MeasurementResult>) {
      state.rows = state.rows.map((row) =>
        row.rowId === action.payload.rowId && row.status === 'completed' && row.annotationId === action.payload.annotationId
          ? { status: 'completed', ...action.payload }
          : row,
      );
    },
    measurementDeleted(state, action: PayloadAction<{ rowId: string }>) {
      state.rows = state.rows.filter((row) => row.rowId !== action.payload.rowId);
    },
  },
});

export const {
  measurementAddedReceived,
  measurementAddedRequested,
  measurementCancelled,
  measurementDeleted,
  measurementDrawingStarted,
  measurementUpdatedReceived,
} = measurementsSlice.actions;

export const measurementActivationRequested = createAction<{ rowId: string; toolName: ViewerToolName }>('measurements/measurementActivationRequested');
export const measurementCancellationRequested = createAction<{ rowId: string }>('measurements/measurementCancellationRequested');
export const measurementFocusRequested = createAction<{ annotationId: string }>('measurements/measurementFocusRequested');
export const measurementDeletionRequested = createAction<{ rowId: string; annotationId: string }>('measurements/measurementDeletionRequested');
export const measurementsReducer = measurementsSlice.reducer;

type MeasurementsRootState = { measurements: MeasurementsState };
export const selectMeasurements = (state: MeasurementsRootState) => state.measurements.rows;
export const selectTotals = createSelector([selectMeasurements], (measurements) =>
  measurements.reduce<{ area: Record<string, number>; length: Record<string, number> }>(
    (totals, measurement) => {
      if (measurement.status === 'completed') {
        const { unit, value } = measurement.metric;
        const target = measurement.toolName === ViewerTool.LENGTH ? totals.length : totals.area;
        target[unit] = (target[unit] ?? 0) + value;
      }
      return totals;
    },
    { area: {}, length: {} },
  ),
);
