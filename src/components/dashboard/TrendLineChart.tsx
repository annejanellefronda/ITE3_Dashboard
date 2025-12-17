import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataRecord } from '@/types/dashboard';
import { aggregateByYear } from '@/utils/dataUtils';
import { TrendingUp, Info } from 'lucide-react';

interface TrendLineChartProps {
  data: DataRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sugarValue = payload.find((p: any) => p.dataKey === 'avgSugar')?.value || 0;
    const diabetesValue = payload.find((p: any) => p.dataKey === 'avgDiabetes')?.value || 0;
    
    // Calculate relative insight
    const ratio = sugarValue > 0 ? (diabetesValue / sugarValue * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <p className="font-semibold text-foreground border-b border-border pb-2 mb-2">
          Year: {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Sugar Consumption:</span>
            <span className="font-mono font-medium" style={{ color: 'hsl(174, 62%, 38%)' }}>
              {sugarValue.toFixed(1)} kg/capita
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Diabetes Prevalence:</span>
            <span className="font-mono font-medium" style={{ color: 'hsl(12, 76%, 61%)' }}>
              {diabetesValue.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            Diabetes-to-Sugar ratio: {ratio}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const TrendLineChart = ({ data }: TrendLineChartProps) => {
  const chartData = useMemo(() => aggregateByYear(data), [data]);

  return (
    <div className="chart-card animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="chart-title mb-1">Sugar Consumption vs Diabetes Over Time</h3>
          <p className="text-xs text-muted-foreground">
            Track how both metrics trend together across years. Rising lines indicate increasing rates.
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Sugar (kg)', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Diabetes (%)', angle: 90, position: 'insideRight', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => 
                value === 'avgDiabetes' ? 'Diabetes Prevalence (%)' : 'Sugar Consumption (kg/capita)'
              }
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgSugar"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--chart-1))' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgDiabetes"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--chart-3))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
