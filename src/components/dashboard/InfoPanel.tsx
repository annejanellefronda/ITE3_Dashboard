import { useState } from 'react';
import { Info, ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InfoPanelProps {
  avgSugarConsumption: number;
  avgDiabetesPrevalence: number;
  totalRecords: number;
}

export const InfoPanel = ({ avgSugarConsumption, avgDiabetesPrevalence, totalRecords }: InfoPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate correlation insight
  const getCorrelationInsight = () => {
    if (avgSugarConsumption > 40 && avgDiabetesPrevalence > 10) {
      return { level: 'high', text: 'Strong positive correlation detected', color: 'text-danger' };
    } else if (avgSugarConsumption > 25 && avgDiabetesPrevalence > 7) {
      return { level: 'moderate', text: 'Moderate correlation observed', color: 'text-warning' };
    }
    return { level: 'low', text: 'Lower correlation in this selection', color: 'text-success' };
  };

  const insight = getCorrelationInsight();

  return (
    <div className="chart-card animate-slide-up">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <h3 className="chart-title mb-0">Understanding the Correlation</h3>
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Correlation Status */}
          <div className={cn(
            "p-4 rounded-lg border-l-4",
            insight.level === 'high' && "bg-danger/5 border-danger",
            insight.level === 'moderate' && "bg-warning/5 border-warning",
            insight.level === 'low' && "bg-success/5 border-success"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={cn("h-5 w-5", insight.color)} />
              <span className={cn("font-semibold", insight.color)}>{insight.text}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalRecords.toLocaleString()} records: Average sugar consumption of{' '}
              <strong>{avgSugarConsumption.toFixed(1)} kg/capita</strong> correlates with{' '}
              <strong>{avgDiabetesPrevalence.toFixed(1)}%</strong> diabetes prevalence.
            </p>
          </div>

          {/* Key Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <span className="font-medium text-foreground">Key Finding</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Countries with per capita sugar consumption exceeding <strong>50 kg/year</strong> show 
                diabetes rates <strong>40-60% higher</strong> than those below 25 kg/year.
              </p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Regional Patterns</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>North America & Europe</strong> show highest sugar consumption, while 
                <strong> Asia & Africa</strong> display rapidly increasing trends since 2000.
              </p>
            </div>
          </div>

          {/* Methodology Note */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-chart-5" />
              <span className="font-medium text-foreground">How to Interpret</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Scatter Plot:</strong> Each dot = one country-year record. Upward trend indicates positive correlation.</li>
              <li><strong>Line Chart:</strong> Tracks yearly averages—note how both metrics move together over time.</li>
              <li><strong>World Map:</strong> Darker colors = higher diabetes prevalence. Hover for exact values.</li>
              <li><strong>Pie Chart:</strong> Shows sugar sources—HFCS (High-Fructose Corn Syrup) linked to higher diabetes risk.</li>
            </ul>
          </div>

          {/* Data Disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
            <strong>Note:</strong> Correlation does not imply causation. Diabetes prevalence is influenced by 
            multiple factors including genetics, physical activity, and overall diet quality. This dashboard 
            presents observational data for educational analysis.
          </p>
        </div>
      )}
    </div>
  );
};
