type MeasurementTotalsProps = { totalsByUnit: Record<string, number> };

export function MeasurementTotals({ totalsByUnit }: MeasurementTotalsProps) {
  const totalEntries = Object.entries(totalsByUnit);
  return (
    <footer className="tw:mt-auto tw:grid tw:gap-2 tw:border-t tw:border-neutral-200 tw:pt-4">
      <p className="tw:text-sm tw:font-medium tw:text-neutral-950">Сума площ</p>
      {totalEntries.length ? (
        totalEntries.map(([unit, value]) => (
          <p key={unit} className="tw:text-2xl tw:font-semibold tw:text-neutral-950">
            {value.toFixed(1)} <span className="tw:text-sm tw:font-medium">{unit}</span>
          </p>
        ))
      ) : (
        <p className="tw:text-sm tw:text-neutral-500">-</p>
      )}
    </footer>
  );
}
