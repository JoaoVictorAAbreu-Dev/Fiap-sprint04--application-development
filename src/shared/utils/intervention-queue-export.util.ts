import type { VegetationMonitoringPoint } from '@/domain/entities/vegetation-monitoring.entity';

const CSV_HEADERS = ['Posição', 'ID', 'Rodovia', 'Trecho', 'Quilômetro', 'Altura (cm)', 'Condição', 'Ação recomendada'];

const escapeCsvCell = (value: string | number): string => `"${String(value).replaceAll('"', '""')}"`;

export const buildInterventionQueueCsv = (points: readonly VegetationMonitoringPoint[]): string => {
  const rows = points.map((point, index) => [
    index + 1,
    point.id,
    point.highway,
    point.segment,
    point.km.toFixed(1).replace('.', ','),
    point.heightCm?.toFixed(1).replace('.', ',') ?? '',
    point.classification,
    point.recommendedAction,
  ]);

  return [CSV_HEADERS, ...rows].map((row) => row.map(escapeCsvCell).join(';')).join('\r\n');
};
