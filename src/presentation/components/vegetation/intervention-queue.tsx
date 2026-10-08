import { useState } from 'react';
import type { VegetationMonitoringPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { VegetationClassificationBadge } from '@/presentation/components/shared/vegetation-classification-badge';
import { InterventionQueueActions } from '@/presentation/components/vegetation/intervention-queue-actions';

type InterventionQueueProps = {
  queue: readonly VegetationMonitoringPoint[];
  limit?: number;
};

type QueueItemsProps = {
  points: readonly VegetationMonitoringPoint[];
};

const QueueItems = ({ points }: QueueItemsProps) => (
  <>
    {points.map((point, index) => (
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
  </>
);

export const InterventionQueue = ({ queue, limit = 5 }: InterventionQueueProps) => {
  const [expanded, setExpanded] = useState(false);
  const visibleQueue = expanded ? queue : queue.slice(0, limit);

  return (
    <article className="intervention-queue-print rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Fila de atendimento</h3>
          <p className="mt-1 text-sm text-slate-600">
            Pontos que exigem serviço de campo, do mais urgente para o menos urgente.
          </p>
        </div>
        <InterventionQueueActions queue={queue} />
      </div>

      {queue.length === 0 ? (
        <p className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
          Nenhum ponto exige intervenção no momento.
        </p>
      ) : (
        <>
          <ol className="queue-screen mt-4 space-y-2">
            <QueueItems points={visibleQueue} />
          </ol>
          <ol className="queue-print-only mt-4 space-y-2">
            <QueueItems points={queue} />
          </ol>
        </>
      )}

      {queue.length > limit ? (
        <div className="no-print mt-3 flex flex-wrap items-center gap-3">
          <p className="text-xs text-slate-500">
            Exibindo {visibleQueue.length} de {queue.length} pontos que exigem intervenção.
          </p>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="text-sm font-semibold text-emerald-800 underline underline-offset-2"
          >
            {expanded ? 'Mostrar menos' : 'Ver todos'}
          </button>
        </div>
      ) : null}
    </article>
  );
};
