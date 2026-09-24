import { Badge, Button, EyeIcon, PlayIcon, TrashIcon } from '../../sharedComponents';
import type { Measurement } from '../../store/slices/measurementsSlice';

type MeasurementRowProps = {
  measurement: Measurement;
  index: number;
  onActivate: (rowId: string) => void;
  onDeactivate: (rowId: string) => void;
  onFocus: (annotationId: string) => void;
  onDelete: (rowId: string, annotationId: string) => void;
};

const statusLabel: Record<Measurement['status'], string> = {
  waiting: 'Очікує',
  drawing: 'Малювання…',
  completed: 'Готово',
};

export function MeasurementRow({ measurement, index, onActivate, onDeactivate, onFocus, onDelete }: MeasurementRowProps) {
  const area = measurement.status === 'completed' ? measurement.area : undefined;
  const name = `Вимірювання ${String(index + 1).padStart(2, '0')}`;

  return (
    <tr className="tw:border-t tw:border-neutral-200 tw:text-neutral-800">
      <td className="tw:truncate tw:px-2 tw:py-3 tw:font-medium" title={name}>
        {name}
      </td>
      <td className="tw:px-2 tw:py-3">
        <Badge status={measurement.status}>{statusLabel[measurement.status]}</Badge>
      </td>
      <td className="tw:px-2 tw:py-3 tw:font-medium">
        {area ? area.value.toFixed(1) : '-'}
        {area && <span className="tw:ml-1 tw:sm:hidden">{area.unit}</span>}
      </td>
      <td className="tw:hidden tw:px-2 tw:py-3 tw:font-medium tw:sm:table-cell">{area?.unit ?? '-'}</td>
      <td className="tw:px-2 tw:py-3">
        {measurement.status === 'waiting' && (
          <Button className="tw:w-full tw:px-2" onClick={() => onActivate(measurement.rowId)}>
            <PlayIcon className="tw:size-4" />
            Активувати
          </Button>
        )}
        {measurement.status === 'drawing' && (
          <Button className="tw:w-full tw:px-2" variant="neutral" onClick={() => onDeactivate(measurement.rowId)}>
            Скасувати
          </Button>
        )}
        {measurement.status === 'completed' && (
          <div className="tw:flex tw:gap-2">
            <Button className="tw:min-w-0 tw:flex-1 tw:px-2" variant="outline" onClick={() => onFocus(measurement.annotationId)}>
              <EyeIcon className="tw:size-4" />
              Фокус
            </Button>
            <Button
              aria-label="Видалити вимірювання"
              className="tw:px-2 tw:sm:flex-1"
              title="Видалити"
              variant="danger"
              onClick={() => onDelete(measurement.rowId, measurement.annotationId)}
            >
              <TrashIcon className="tw:size-4" />
              <span className="tw:hidden tw:sm:inline">Видалити</span>
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
