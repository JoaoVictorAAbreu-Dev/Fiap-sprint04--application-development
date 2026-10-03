import type { PointCondition } from '@/domain/entities/vegetation-monitoring.entity';
import { badgeClass } from '@/presentation/components/vegetation/condition-styles';

type VegetationClassificationBadgeProps = {
  classification: PointCondition;
};

export const VegetationClassificationBadge = ({
  classification,
}: VegetationClassificationBadgeProps) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass[classification]}`}
  >
    {classification}
  </span>
);
