import type { PointFilters } from '@/domain/entities/vegetation-monitoring.entity';
import { CONDITION_ORDER } from '@/shared/utils/monitored-points.util';

type VegetationFiltersProps = {
  filters: PointFilters;
  highways: readonly string[];
  onChange: (filters: PointFilters) => void;
};

const selectClass = 'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800';

export const VegetationFilters = ({ filters, highways, onChange }: VegetationFiltersProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
      Classificação
      <select
        className={selectClass}
        value={filters.classification}
        onChange={(event) =>
          onChange({ ...filters, classification: event.target.value as PointFilters['classification'] })
        }
      >
        <option value="todas">Todas</option>
        {CONDITION_ORDER.map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </select>
    </label>

    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
      Rodovia
      <select
        className={selectClass}
        value={filters.highway}
        onChange={(event) => onChange({ ...filters, highway: event.target.value })}
      >
        <option value="todas">Todas</option>
        {highways.map((highway) => (
          <option key={highway} value={highway}>
            {highway}
          </option>
        ))}
      </select>
    </label>
  </div>
);
