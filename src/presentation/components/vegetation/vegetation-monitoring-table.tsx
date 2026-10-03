import dayjs from 'dayjs';
import type { VegetationMonitoringPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { VegetationClassificationBadge } from '@/presentation/components/shared/vegetation-classification-badge';
import { rowClass } from '@/presentation/components/vegetation/condition-styles';

type VegetationMonitoringTableProps = {
  points: readonly VegetationMonitoringPoint[];
  totalPoints?: number;
};

const formatKm = (km: number) => `km ${km.toFixed(1).replace('.', ',')}`;

export const VegetationMonitoringTable = ({ points, totalPoints }: VegetationMonitoringTableProps) => (
  <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Classificação da vegetação por ponto</h3>
        <p className="mt-1 text-sm text-slate-600">
          Ordenado por prioridade de atendimento. A classificação é automática, conforme a altura da última leitura.
        </p>
      </div>
      <span className="text-xs font-medium text-slate-500">
        {totalPoints !== undefined && totalPoints !== points.length
          ? `${points.length} de ${totalPoints} pontos`
          : `${points.length} pontos classificados`}
      </span>
    </div>

    {points.length === 0 ? (
      <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        Nenhum ponto encontrado para os filtros selecionados.
      </p>
    ) : (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <caption className="sr-only">
            Localização, altura da vegetação, última leitura, classificação e ação recomendada para cada ponto monitorado
          </caption>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" className="py-3 pr-4">ID</th>
              <th scope="col" className="py-3 pr-4">Localização</th>
              <th scope="col" className="py-3 pr-4">Altura da vegetação</th>
              <th scope="col" className="py-3 pr-4">Última leitura</th>
              <th scope="col" className="py-3 pr-4">Classificação</th>
              <th scope="col" className="py-3">Ação recomendada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {points.map((point) => (
              <tr key={point.id} className={rowClass[point.classification]}>
                <td className="whitespace-nowrap py-3 pr-4 pl-2 font-mono text-xs text-slate-600">{point.id}</td>
                <td className="py-3 pr-4 font-medium text-slate-900">
                  {point.highway} · {formatKm(point.km)} · {point.segment}
                </td>
                <td className="whitespace-nowrap py-3 pr-4">
                  {point.heightCm === null ? '—' : `${point.heightCm.toFixed(1)} cm`}
                </td>
                <td className="whitespace-nowrap py-3 pr-4">{dayjs(point.lastReadingAt).format('DD/MM/YYYY HH:mm')}</td>
                <td className="py-3 pr-4">
                  <VegetationClassificationBadge classification={point.classification} />
                </td>
                <td className="min-w-64 py-3">{point.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </article>
);
