import type {
  MonitoredPoint,
  VegetationHeightBand,
  VegetationMonitoringPoint,
} from '@/domain/entities/vegetation-monitoring.entity';
import {
  INVALID_READING_ACTION,
  INVALID_READING_PRIORITY,
  VEGETATION_HEIGHT_BANDS,
} from '@/shared/constants/vegetation-height-bands';

export const isValidHeightCm = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export const classifyVegetationHeight = (heightCm: number): VegetationHeightBand => {
  if (!isValidHeightCm(heightCm)) {
    throw new RangeError('A altura da vegetação deve ser um número finito maior ou igual a zero.');
  }

  const matchingBand = VEGETATION_HEIGHT_BANDS.find((band) => heightCm <= band.maxHeightCm);

  if (!matchingBand) {
    throw new RangeError(`Nenhuma faixa de classificação cobre a altura de ${heightCm} cm.`);
  }

  return matchingBand;
};

/**
 * Classifica um ponto sem lançar exceção: leituras ausentes ou inválidas viram "Leitura inválida"
 * para que um único dado ruim não derrube o processamento do lote.
 */
export const classifyMonitoredPoint = (point: MonitoredPoint): VegetationMonitoringPoint => {
  if (!isValidHeightCm(point.heightCm)) {
    return {
      ...point,
      classification: 'Leitura inválida',
      priority: INVALID_READING_PRIORITY,
      recommendedAction: INVALID_READING_ACTION,
    };
  }

  const band = classifyVegetationHeight(point.heightCm);

  return {
    ...point,
    classification: band.classification,
    priority: band.priority,
    recommendedAction: band.recommendedAction,
  };
};

export const classifyMonitoredPoints = (points: readonly MonitoredPoint[]): VegetationMonitoringPoint[] => {
  const classified: VegetationMonitoringPoint[] = [];

  points.forEach((point) => {
    classified.push(classifyMonitoredPoint(point));
  });

  return classified;
};
