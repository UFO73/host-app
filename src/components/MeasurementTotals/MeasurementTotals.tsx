import { SigmaIcon } from '../../sharedComponents';
import { colorClasses } from '../../styles/colors';

type MeasurementTotalsProps = {
  totals: {
    area: Record<string, number>;
    length: Record<string, number>;
  };
};

function TotalValues({ totals, emptyUnit }: { totals: Record<string, number>; emptyUnit: string }) {
  const entries = Object.entries(totals);

  if (!entries.length) {
    return <p className="tw:text-2xl tw:font-semibold tw:text-neutral-950">0 {emptyUnit}</p>;
  }

  return entries.map(([unit, value]) => (
    <p key={unit} className="tw:text-2xl tw:font-semibold tw:text-neutral-950">
      {value.toFixed(1)} <span className="tw:text-sm">{unit}</span>
    </p>
  ));
}

export function MeasurementTotals({ totals }: MeasurementTotalsProps) {
  return (
    <footer className={`tw:mt-auto tw:grid tw:grid-cols-2 tw:gap-4 tw:rounded-md tw:border tw:p-4 ${colorClasses.panel}`}>
      <div className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-x-3 tw:gap-y-1">
        <SigmaIcon className="tw:row-span-2 tw:size-8 tw:text-blue-600" />
        <p className="tw:text-sm tw:font-semibold tw:text-neutral-900">Сума площ</p>
        <div className="tw:flex tw:flex-wrap tw:gap-x-4">
          <TotalValues totals={totals.area} emptyUnit="mm²" />
        </div>
      </div>
      <div className="tw:grid tw:gap-1">
        <p className="tw:text-sm tw:font-semibold tw:text-neutral-900">Сума довжин</p>
        <div className="tw:flex tw:flex-wrap tw:gap-x-4">
          <TotalValues totals={totals.length} emptyUnit="mm" />
        </div>
      </div>
    </footer>
  );
}
