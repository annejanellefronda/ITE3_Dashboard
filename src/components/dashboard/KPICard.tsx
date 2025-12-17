import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  iconColor?: string;
}

export const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendValue,
  className,
  iconColor = 'text-primary',
}: KPICardProps) => {
  return (
    <div className={cn('kpi-card animate-slide-up', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="kpi-label">{title}</p>
          <p className="kpi-value mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend === 'up' && 'text-success',
                  trend === 'down' && 'text-danger',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl bg-secondary/50', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
