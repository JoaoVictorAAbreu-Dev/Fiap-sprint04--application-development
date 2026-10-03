import type { PointCondition } from '@/domain/entities/vegetation-monitoring.entity';
import { cardClass } from '@/presentation/components/vegetation/condition-styles';

type ConditionSummaryProps = {
  summary: Record<PointCondition, number>;
};

const DISPLAY_ORDER: readonly PointCondition[] = [
  'Intervenção Prioritária',
  'Intervenção Programada',
  'Atenção',
  'Monitorado',
  'Leitura inválida',
];

export const ConditionSummary = ({ summary }: ConditionSummaryProps) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Pontos por classificação">
    {DISPLAY_ORDER.map((condition) => (
      <article key={condition} className={`rounded-xl border p-4 ${cardClass[condition]}`}>
        <p className="text-xs font-semibold uppercase tracking-wide">{condition}</p>
        <p className="mt-1 text-3xl font-bold">{summary[condition]}</p>
      </article>
    ))}
  </div>
);
