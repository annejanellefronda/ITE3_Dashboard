import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import { DataRecord } from '@/types/dashboard';
import { getCorrelationData } from '@/utils/dataUtils';
import { Target, Info } from 'lucide-react';

interface CorrelationScatterChartProps {
  data: DataRecord[];
}

const CONTINENT_COLORS: Record<string, string> = {
  'Africa': 'hsl(12, 76%, 61%)',
  'Asia': 'hsl(174, 62%, 38%)',
  'Europe': 'hsl(200, 80%, 50%)',
  'North America': 'hsl(262, 52%, 55%)',
  'South America': 'hsl(45, 93%, 47%)',
  'Oceania': 'hsl(142, 71%, 45%)',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const riskLevel = data.diabetesPrevalence > 12 ? 'High' : data.diabetesPrevalence > 8 ? 'Moderate' : 'Lower';
    const riskColor = data.diabetesPrevalence > 12 ? 'text-danger' : data.diabetesPrevalence > 8 ? 'text-warning' : 'text-success';
    
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <p className="font-semibold text-foreground border-b border-border pb-2 mb-2">
          {data.country}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Continent:</span>
            <span 
              className="font-medium text-sm px-2 py-0.5 rounded"
              style={{ backgroundColor: CONTINENT_COLORS[data.continent] + '20', color: CONTINENT_COLORS[data.continent] }}
            >
              {data.continent}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Sugar Consumption:</span>
            <span className="font-mono font-medium text-foreground">
              {data.sugarConsumption.toFixed(1)} kg
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Diabetes Rate:</span>
            <span className="font-mono font-medium text-foreground">
              {data.diabetesPrevalence.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Risk Level: <span className={`font-semibold ${riskColor}`}>{riskLevel}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CorrelationScatterChart = ({ data }: CorrelationScatterChartProps) => {
  const chartData = useMemo(() => getCorrelationData(data), [data]);
  
  const groupedData = useMemo(() => {
    const groups: Record<string, typeof chartData> = {};
    chartData.forEach((d) => {
      if (!groups[d.continent]) groups[d.continent] = [];
      groups[d.continent].push(d);
    });
    return groups;
  }, [chartData]);

  // Calculate average values for reference lines
  const avgSugar = chartData.reduce((sum, d) => sum + d.sugarConsumption, 0) / chartData.length;
  const avgDiabetes = chartData.reduce((sum, d) => sum + d.diabetesPrevalence, 0) / chartData.length;

  return (
    <div className="chart-card animate-slide-up">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="chart-title mb-1">Sugar vs Diabetes Correlation</h3>
          <p className="text-xs text-muted-foreground">
            Points in upper-right quadrant indicate high sugar + high diabetes. Hover for country details.
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Target className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="sugarConsumption" 
              name="Sugar Consumption"
              unit=" kg"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ 
                value: 'Per Capita Sugar (kg)', 
                position: 'insideBottom', 
                offset: -5,
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))'
              }}
            />
            <YAxis 
              type="number" 
              dataKey="diabetesPrevalence" 
              name="Diabetes Prevalence"
              unit="%"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ 
                value: 'Diabetes (%)', 
                angle: -90, 
                position: 'insideLeft',
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))'
              }}
            />
            <ZAxis range={[30, 100]} />
            {/* Reference lines showing averages */}
            <ReferenceLine 
              x={avgSugar} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
            />
            <ReferenceLine 
              y={avgDiabetes} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {Object.entries(groupedData).map(([continent, points]) => (
              <Scatter
                key={continent}
                name={continent}
                data={points}
                fill={CONTINENT_COLORS[continent] || 'hsl(var(--chart-1))'}
                opacity={0.7}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Dashed lines show average values. Upper-right = high risk zone.
      </p>
    </div>
  );
};
