import type { VegetationHeightBand } from '@/domain/entities/vegetation-monitoring.entity';

/**
 * Faixas de classificação por altura da vegetação.
 *
 * Os limites (30, 50 e 80 cm) são parâmetros definidos pelo grupo para este protótipo.
 * Não correspondem a uma norma oficial da concessionária. Cada limite superior pertence
 * à faixa que ele encerra (ex.: exatamente 30 cm é "Monitorado").
 */
export const VEGETATION_HEIGHT_BANDS: readonly VegetationHeightBand[] = [
  {
    label: '0 a 30 cm',
    maxHeightCm: 30,
    classification: 'Monitorado',
    priority: 1,
    recommendedAction: 'Manter o monitoramento de rotina.',
  },
  {
    label: 'Acima de 30 até 50 cm',
    maxHeightCm: 50,
    classification: 'Atenção',
    priority: 2,
    recommendedAction: 'Aumentar a frequência de inspeção do ponto.',
  },
  {
    label: 'Acima de 50 até 80 cm',
    maxHeightCm: 80,
    classification: 'Intervenção Programada',
    priority: 3,
    recommendedAction: 'Programar o serviço de roçada.',
  },
  {
    label: 'Acima de 80 cm',
    maxHeightCm: Number.POSITIVE_INFINITY,
    classification: 'Intervenção Prioritária',
    priority: 4,
    recommendedAction: 'Realizar intervenção imediata e sinalizar a área.',
  },
];

/** A partir desta prioridade o ponto exige serviço de campo (roçada). */
export const INTERVENTION_MIN_PRIORITY = 3;

/** Leitura inválida não é classificada: fica fora da fila de atendimento, mas é destacada e contada. */
export const INVALID_READING_PRIORITY = 0;
export const INVALID_READING_ACTION = 'Revalidar a leitura: verificar o sensor ou reinspecionar o ponto em campo.';
