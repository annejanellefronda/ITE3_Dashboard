import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataRecord } from '@/types/dashboard';
import { aggregateByContinent } from '@/utils/dataUtils';
import { Globe2, Info } from 'lucide-react';

interface ContinentBarChartProps {
  data: DataRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const diabetesValue = payload.find((p: any) => p.dataKey === 'avgDiabetes')?.value || 0;
    const sugarValue = payload.find((p: any) => p.dataKey === 'avgSugar')?.value || 0;
    const records = payload[0]?.payload?.records || 0;
    
    // Determine risk assessment
    const riskLevel = diabetesValue > 10 ? 'High Risk' : diabetesValue > 7 ? 'Moderate Risk' : 'Lower Risk';
    const riskColor = diabetesValue > 10 ? 'text-danger' : diabetesValue > 7 ? 'text-warning' : 'text-success';
    
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <p className="font-semibold text-foreground border-b border-border pb-2 mb-2">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Diabetes Rate:</span>
            <span className="font-mono font-medium" style={{ color: 'hsl(12, 76%, 61%)' }}>
              {diabetesValue.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Sugar Intake:</span>
            <span className="font-mono font-medium" style={{ color: 'hsl(174, 62%, 38%)' }}>
              {sugarValue.toFixed(1)} kg/capita
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Data Points:</span>
            <span className="font-mono text-foreground">{records.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-muted-foreground" />
            <span className={`text-xs font-semibold ${riskColor}`}>{riskLevel} Region</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ContinentBarChart = ({ data }: ContinentBarChartProps) => {
  const chartData = useMemo(() => aggregateByContinent(data), [data]);

  return (
    <div className="chart-card animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="chart-title mb-1">Diabetes & Sugar by Continent</h3>
          <p className="text-xs text-muted-foreground">
            Compare regional health metrics. Taller coral bars = higher diabetes rates.
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Globe2 className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="continent" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              angle={-15}
              textAnchor="end"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => 
                value === 'avgDiabetes' ? 'Diabetes (%)' : 'Sugar (kg/capita)'
              }
            />
            <Bar 
              dataKey="avgDiabetes" 
              fill="hsl(var(--chart-3))" 
              radius={[4, 4, 0, 0]}
              name="avgDiabetes"
            />
            <Bar 
              dataKey="avgSugar" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
              name="avgSugar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
