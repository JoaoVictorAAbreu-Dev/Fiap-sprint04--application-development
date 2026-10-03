import type { PointCondition } from '@/domain/entities/vegetation-monitoring.entity';

export const badgeClass: Record<PointCondition, string> = {
  Monitorado: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  Atenção: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  'Intervenção Programada': 'bg-orange-100 text-orange-800 ring-orange-600/20',
  'Intervenção Prioritária': 'bg-rose-100 text-rose-800 ring-rose-600/20',
  'Leitura inválida': 'bg-slate-200 text-slate-700 ring-slate-500/20',
};

export const rowClass: Record<PointCondition, string> = {
  Monitorado: '',
  Atenção: 'bg-amber-50/60',
  'Intervenção Programada': 'bg-orange-50',
  'Intervenção Prioritária': 'bg-rose-50 font-medium',
  'Leitura inválida': 'bg-slate-100',
};

export const cardClass: Record<PointCondition, string> = {
  Monitorado: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Atenção: 'border-amber-200 bg-amber-50 text-amber-900',
  'Intervenção Programada': 'border-orange-200 bg-orange-50 text-orange-900',
  'Intervenção Prioritária': 'border-rose-200 bg-rose-50 text-rose-900',
  'Leitura inválida': 'border-slate-300 bg-slate-100 text-slate-800',
};
