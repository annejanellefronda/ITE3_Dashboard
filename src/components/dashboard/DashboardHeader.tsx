import { Activity, ExternalLink, Github } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <header className="gradient-header text-primary-foreground py-6 px-6 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-xl">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Diabetes & Diet Dashboard
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base mt-1">
                Analyzing Regional Sugar Consumption vs. Diabetes Cases
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-primary-foreground/80">
            <span className="px-3 py-1 bg-primary-foreground/10 rounded-full">
              10,000+ Records
            </span>
            <span className="px-3 py-1 bg-primary-foreground/10 rounded-full">
              21 Variables
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
