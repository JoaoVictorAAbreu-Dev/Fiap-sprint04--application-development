import type { VegetationMonitoringPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { buildInterventionQueueCsv } from '@/shared/utils/intervention-queue-export.util';

type InterventionQueueActionsProps = {
  queue: readonly VegetationMonitoringPoint[];
};

export const InterventionQueueActions = ({ queue }: InterventionQueueActionsProps) => {
  const downloadCsv = () => {
    const csv = `\uFEFF${buildInterventionQueueCsv(queue)}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `fila-intervencao-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="no-print flex flex-wrap gap-2" aria-label="Ações da fila de atendimento">
      <button
        type="button"
        onClick={downloadCsv}
        disabled={queue.length === 0}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Exportar CSV
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        disabled={queue.length === 0}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Imprimir fila
      </button>
    </div>
  );
};
