import type { MeasurementsState } from './slices/measurementsSlice';

const STORAGE_KEY = 'scoring-form-measurements';
const emptyState: MeasurementsState = { rows: [] };

const getStorageKey = (studyInstanceUid: string) => `${STORAGE_KEY}:${studyInstanceUid}`;

export function loadMeasurements(studyInstanceUid: string): MeasurementsState {
  try {
    const value = sessionStorage.getItem(getStorageKey(studyInstanceUid));
    if (!value) return emptyState;

    const state = JSON.parse(value) as MeasurementsState;
    return {
      rows: state.rows.map((row) => (row.status === 'drawing' ? { status: 'waiting', rowId: row.rowId, toolName: row.toolName } : row)),
    };
  } catch {
    return emptyState;
  }
}

export function saveMeasurements(studyInstanceUid: string, state: MeasurementsState) {
  sessionStorage.setItem(getStorageKey(studyInstanceUid), JSON.stringify(state));
}
