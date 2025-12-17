import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataRecord } from '@/types/dashboard';
import { getSugarSourceBreakdown } from '@/utils/dataUtils';
import { PieChartIcon, AlertCircle } from 'lucide-react';

interface SugarSourcePieChartProps {
  data: DataRecord[];
}

const COLORS = [
  'hsl(174, 62%, 38%)',   // Primary teal - Sugarcane
  'hsl(200, 80%, 50%)',   // Blue - Beet
  'hsl(12, 76%, 61%)',    // Coral - HFCS
  'hsl(262, 52%, 55%)',   // Purple - Other
];

const SOURCE_INFO: Record<string, { risk: string; description: string }> = {
  'Sugarcane': { 
    risk: 'Moderate', 
    description: 'Natural source, contains some nutrients. Common in tropical regions.' 
  },
  'Beet': { 
    risk: 'Moderate', 
    description: 'Refined sugar from sugar beets. Primary source in temperate climates.' 
  },
  'HFCS': { 
    risk: 'Higher', 
    description: 'High-Fructose Corn Syrup. Linked to higher metabolic risks in studies.' 
  },
  'Other': { 
    risk: 'Varies', 
    description: 'Includes honey, maple syrup, artificial sweeteners, and other sources.' 
  },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const info = SOURCE_INFO[data.name] || { risk: 'Unknown', description: 'No data available.' };
    const riskColor = info.risk === 'Higher' ? 'text-danger' : info.risk === 'Moderate' ? 'text-warning' : 'text-muted-foreground';
    
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.payload.fill }}
          />
          <p className="font-semibold text-foreground">{data.name}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Share:</span>
            <span className="font-mono font-bold text-foreground">
              {data.value.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Health Risk:</span>
            <span className={`font-semibold text-sm ${riskColor}`}>
              {info.risk}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
          {info.description}
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const SugarSourcePieChart = ({ data }: SugarSourcePieChartProps) => {
  const chartData = useMemo(() => getSugarSourceBreakdown(data), [data]);

  return (
    <div className="chart-card animate-slide-up">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="chart-title mb-1">Sugar Sources Breakdown</h3>
          <p className="text-xs text-muted-foreground">
            Where does sugar come from? HFCS linked to higher diabetes risk.
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <PieChartIcon className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      {/* HFCS Warning */}
      <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg mb-3">
        <AlertCircle className="h-4 w-4 text-accent flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong>HFCS</strong> (coral) is associated with increased metabolic syndrome risk in clinical studies.
        </p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={110}
              innerRadius={45}
              fill="#8884d8"
              dataKey="value"
              stroke="hsl(var(--card))"
              strokeWidth={3}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
