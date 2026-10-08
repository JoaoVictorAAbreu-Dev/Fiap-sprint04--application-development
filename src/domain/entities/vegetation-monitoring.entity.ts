export type VegetationClassification =
  | 'Monitorado'
  | 'Atenção'
  | 'Intervenção Programada'
  | 'Intervenção Prioritária';

/** Estado de um ponto: uma das quatro classificações ou leitura que não pôde ser classificada. */
export type PointCondition = VegetationClassification | 'Leitura inválida';

export type VegetationHeightBand = {
  label: string;
  maxHeightCm: number;
  classification: VegetationClassification;
  /** Quanto maior, mais urgente o atendimento (1 = Monitorado ... 4 = Intervenção Prioritária). */
  priority: number;
  recommendedAction: string;
};

export type MonitoredPoint = {
  id: string;
  highway: string;
  segment: string;
  km: number;
  /** `null` representa leitura ausente ou falha do sensor. */
  heightCm: number | null;
  /** Data/hora da última leitura em formato ISO 8601. */
  lastReadingAt: string;
};

export type VegetationMonitoringPoint = MonitoredPoint & {
  classification: PointCondition;
  priority: number;
  recommendedAction: string;
  classificationBandLabel: string | null;
};

export type PointFilters = {
  classification: PointCondition | 'todas';
  highway: string | 'todas';
  search: string;
};

export type ReadingHistoryEntry = {
  heightCm: number | null;
  readAt: string;
};

export type ReadingHistoryByPoint = Record<string, ReadingHistoryEntry[]>;
