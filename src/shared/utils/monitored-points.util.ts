import type {
  MonitoredPoint,
  PointCondition,
  PointFilters,
  VegetationMonitoringPoint,
} from '@/domain/entities/vegetation-monitoring.entity';
import { INTERVENTION_MIN_PRIORITY } from '@/shared/constants/vegetation-height-bands';
import { isValidHeightCm } from '@/shared/utils/vegetation-classification.util';

export const CONDITION_ORDER: readonly PointCondition[] = [
  'Intervenção Prioritária',
  'Intervenção Programada',
  'Atenção',
  'Monitorado',
  'Leitura inválida',
];

/** Ordena do mais urgente para o menos urgente; empate: maior altura primeiro; depois por ID (estável). */
export const sortByPriority = (points: readonly VegetationMonitoringPoint[]): VegetationMonitoringPoint[] =>
  [...points].sort(
    (a, b) =>
      b.priority - a.priority ||
      (b.heightCm ?? -1) - (a.heightCm ?? -1) ||
      a.id.localeCompare(b.id),
  );

export const getInterventionQueue = (
  points: readonly VegetationMonitoringPoint[],
): VegetationMonitoringPoint[] =>
  sortByPriority(points.filter((point) => point.priority >= INTERVENTION_MIN_PRIORITY));

export const countInterventions = (points: readonly VegetationMonitoringPoint[]): number =>
  points.filter((point) => point.priority >= INTERVENTION_MIN_PRIORITY).length;

export const summarizeByCondition = (
  points: readonly VegetationMonitoringPoint[],
): Record<PointCondition, number> => {
  const summary: Record<PointCondition, number> = {
    Monitorado: 0,
    Atenção: 0,
    'Intervenção Programada': 0,
    'Intervenção Prioritária': 0,
    'Leitura inválida': 0,
  };

  points.forEach((point) => {
    summary[point.classification] += 1;
  });

  return summary;
};

/** Média apenas das leituras válidas; `null` quando não há nenhuma. */
export const calculateAverageHeight = (points: readonly VegetationMonitoringPoint[]): number | null => {
  const heights = points.map((point) => point.heightCm).filter(isValidHeightCm);

  if (heights.length === 0) {
    return null;
  }

  return heights.reduce((sum, height) => sum + height, 0) / heights.length;
};

export const filterPoints = (
  points: readonly VegetationMonitoringPoint[],
  filters: PointFilters,
): VegetationMonitoringPoint[] =>
  points.filter(
    (point) =>
      (filters.classification === 'todas' || point.classification === filters.classification) &&
      (filters.highway === 'todas' || point.highway === filters.highway) &&
      matchesSearch(point, filters.search ?? ''),
  );

const matchesSearch = (point: VegetationMonitoringPoint, search: string): boolean => {
  const query = search.trim().toLocaleLowerCase('pt-BR');
  if (!query) return true;

  return [point.id, point.highway, point.segment, String(point.km), point.km.toFixed(1).replace('.', ',')]
    .some((value) => value.toLocaleLowerCase('pt-BR').includes(query));
};

export const listHighways = (points: readonly MonitoredPoint[]): string[] =>
  [...new Set(points.map((point) => point.highway))].sort((a, b) => a.localeCompare(b));

/** Registra uma nova leitura de altura. Retorna uma nova lista (imutável). */
export const registerReading = (
  points: readonly MonitoredPoint[],
  id: string,
  heightCm: number,
  readAt: string,
): MonitoredPoint[] => {
  if (!isValidHeightCm(heightCm)) {
    throw new RangeError('A altura da vegetação deve ser um número finito maior ou igual a zero.');
  }

  if (!points.some((point) => point.id === id)) {
    throw new RangeError(`Ponto monitorado não encontrado: ${id}.`);
  }

  return points.map((point) => (point.id === id ? { ...point, heightCm, lastReadingAt: readAt } : point));
};
