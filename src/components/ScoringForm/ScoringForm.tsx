import { useDispatch, useSelector } from 'react-redux';

import { Button, PlusIcon } from '../../sharedComponents';
import {
  measurementActivationRequested,
  measurementAddedRequested,
  measurementCancellationRequested,
  measurementDeletionRequested,
  measurementFocusRequested,
  selectMeasurements,
  selectTotalsByUnit,
} from '../../store/slices/measurementsSlice';
import type { AppDispatch } from '../../store/store';
import { MeasurementList } from '../MeasurementList';
import { MeasurementRow } from '../MeasurementRow';
import { MeasurementTotals } from '../MeasurementTotals';

export function ScoringForm() {
  const dispatch = useDispatch<AppDispatch>();
  const measurements = useSelector(selectMeasurements);
  const totalsByUnit = useSelector(selectTotalsByUnit);

  return (
    <aside
      className="scoring-form-scroll tw:flex tw:min-h-64 tw:flex-col tw:gap-5 tw:border-t tw:border-neutral-200 tw:bg-neutral-50 tw:p-5 tw:lg:min-h-0 tw:lg:overflow-y-auto tw:lg:border-t-0 tw:lg:border-l"
      aria-labelledby="scoring-form-title"
    >
      <h1 id="scoring-form-title" className="tw:sr-only">
        Scoring Form
      </h1>
      <Button className="tw:h-12 tw:w-full tw:text-base" onClick={() => dispatch(measurementAddedRequested())}>
        <PlusIcon className="tw:size-6" />
        Додати вимірювання
      </Button>
      <MeasurementList count={measurements.length}>
        {measurements.map((measurement, index) => (
          <MeasurementRow
            key={measurement.rowId}
            measurement={measurement}
            index={index}
            onActivate={(rowId) => dispatch(measurementActivationRequested({ rowId }))}
            onDeactivate={(rowId) => dispatch(measurementCancellationRequested({ rowId }))}
            onFocus={(annotationId) => dispatch(measurementFocusRequested({ annotationId }))}
            onDelete={(rowId, annotationId) => dispatch(measurementDeletionRequested({ rowId, annotationId }))}
          />
        ))}
      </MeasurementList>
      <MeasurementTotals totalsByUnit={totalsByUnit} />
    </aside>
  );
}
