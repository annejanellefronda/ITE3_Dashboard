import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DataRecord } from '@/types/dashboard';
import { aggregateByRegion } from '@/utils/dataUtils';

interface RegionBarChartProps {
  data: DataRecord[];
}

const COLORS = [
  'hsl(174, 62%, 38%)',
  'hsl(174, 62%, 45%)',
  'hsl(174, 62%, 52%)',
  'hsl(200, 80%, 50%)',
  'hsl(200, 80%, 57%)',
  'hsl(12, 76%, 61%)',
  'hsl(12, 76%, 68%)',
  'hsl(262, 52%, 55%)',
  'hsl(262, 52%, 62%)',
  'hsl(45, 93%, 47%)',
];

export const RegionBarChart = ({ data }: RegionBarChartProps) => {
  const chartData = useMemo(() => {
    const regionData = aggregateByRegion(data);
    return regionData.slice(0, 10); // Top 10 regions
  }, [data]);

  return (
    <div className="chart-card animate-slide-up">
      <h3 className="chart-title">Top 10 Regions by Diabetes Prevalence</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              type="category"
              dataKey="region" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              width={95}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number, name: string) => [
                value.toFixed(2) + '%',
                name === 'avgDiabetes' ? 'Avg Diabetes Prevalence' : 'Records'
              ]}
            />
            <Bar 
              dataKey="avgDiabetes" 
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
