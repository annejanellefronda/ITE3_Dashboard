import { ExternalLink, Database, Info } from 'lucide-react';

export const DashboardFooter = () => {
  return (
    <footer className="bg-card border-t border-border py-6 px-6 mt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database className="h-4 w-4" />
            <span className="text-sm">
              <strong>Data Source:</strong>{' '}
              <a
                href="https://www.kaggle.com/datasets/ak0212/global-sugar-consumption-trends-19602023"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Kaggle Datasets - Global Sugar Consumption & Health Metrics
                <ExternalLink className="h-3 w-3" />
              </a>
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>ITE3-M Dashboard</span>
            </div>
            <span className="text-muted-foreground/50">|</span>
            <span>© 2025 Health Data Analysis Project</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground justify-center">
            <span><strong>Topic:</strong> Diabetes Prevalence & Diet Correlation</span>
            <span><strong>Variables Used:</strong> Country, Year, Sugar Consumption, Diabetes Prevalence, Obesity Rate</span>
            <span><strong>Visualization Types:</strong> Map, Line Chart, Bar Chart, Pie Chart, Scatter Plot</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
