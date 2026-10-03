import type { VegetationMonitoringPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { VegetationClassificationBadge } from '@/presentation/components/shared/vegetation-classification-badge';

type InterventionQueueProps = {
  queue: readonly VegetationMonitoringPoint[];
  limit?: number;
};

export const InterventionQueue = ({ queue, limit = 5 }: InterventionQueueProps) => (
  <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">Fila de atendimento</h3>
    <p className="mt-1 text-sm text-slate-600">
      Pontos que exigem serviço de campo, do mais urgente para o menos urgente.
    </p>

    {queue.length === 0 ? (
      <p className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
        Nenhum ponto exige intervenção no momento.
      </p>
    ) : (
      <ol className="mt-4 space-y-2">
        {queue.slice(0, limit).map((point, index) => (
          <li
            key={point.id}
            className="flex flex-col gap-1 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {index + 1}º · {point.highway} · km {point.km.toFixed(1).replace('.', ',')} · {point.segment}
              </p>
              <p className="text-xs text-slate-600">{point.recommendedAction}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800">{point.heightCm?.toFixed(1)} cm</span>
              <VegetationClassificationBadge classification={point.classification} />
            </div>
          </li>
        ))}
      </ol>
    )}

    {queue.length > limit ? (
      <p className="mt-3 text-xs text-slate-500">
        Exibindo {limit} de {queue.length} pontos que exigem intervenção.
      </p>
    ) : null}
  </article>
);
