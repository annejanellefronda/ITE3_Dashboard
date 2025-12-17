import { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Droplets,
  Globe,
  FileBarChart
} from 'lucide-react';
import { useDataLoader } from '@/hooks/useDataLoader';
import { FilterState, KPIData } from '@/types/dashboard';
import { filterData, calculateKPIs, getYearRange } from '@/utils/dataUtils';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { KPICard } from '@/components/dashboard/KPICard';
import { TrendLineChart } from '@/components/dashboard/TrendLineChart';
import { ContinentBarChart } from '@/components/dashboard/ContinentBarChart';
import { SugarSourcePieChart } from '@/components/dashboard/SugarSourcePieChart';
import { CorrelationScatterChart } from '@/components/dashboard/CorrelationScatterChart';
import { RegionBarChart } from '@/components/dashboard/RegionBarChart';
import { WorldMapChart } from '@/components/dashboard/WorldMapChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { InfoPanel } from '@/components/dashboard/InfoPanel';
import { SEO } from '@/components/SEO';

const Index = () => {
  const { data, loading, error } = useDataLoader();
  
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [1960, 2024],
    continents: [],
    regions: [],
    countries: [],
  });

  // Initialize year range from data
  useEffect(() => {
    if (data.length > 0) {
      const range = getYearRange(data);
      setFilters((f) => ({ ...f, yearRange: range }));
    }
  }, [data]);

  // Filter data based on current filters
  const filteredData = useMemo(() => filterData(data, filters), [data, filters]);

  // Calculate KPIs from filtered data
  const kpis: KPIData = useMemo(() => calculateKPIs(filteredData), [filteredData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <SEO />
      <div className="dashboard-container">
        <DashboardHeader />
      
        <main className="container mx-auto px-4 py-6">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            <KPICard
              title="Total Countries"
              value={kpis.totalCountries}
              icon={Globe}
              subtitle="In filtered data"
              iconColor="text-primary"
            />
            <KPICard
              title="Avg Diabetes Prevalence"
              value={`${kpis.avgDiabetesPrevalence.toFixed(1)}%`}
              icon={Activity}
              subtitle="Population affected"
              iconColor="text-accent"
            />
            <KPICard
              title="Avg Sugar Consumption"
              value={`${kpis.avgSugarConsumption.toFixed(1)} kg`}
              icon={Droplets}
              subtitle="Per capita annually"
              iconColor="text-chart-2"
            />
            <KPICard
              title="Avg Obesity Rate"
              value={`${kpis.avgObesityRate.toFixed(1)}%`}
              icon={TrendingUp}
              subtitle="BMI > 30"
              iconColor="text-warning"
            />
            <KPICard
              title="Total Records"
              value={kpis.totalRecords.toLocaleString()}
              icon={FileBarChart}
              subtitle="Data points"
              iconColor="text-success"
            />
            <KPICard
              title="Avg GDP Per Capita"
              value={`$${(kpis.avgGDP / 1000).toFixed(1)}k`}
              icon={Users}
              subtitle="USD"
              iconColor="text-chart-4"
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <FilterPanel
                  data={data}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                
                {/* Quick Stats */}
                <div className="mt-4 p-4 bg-card rounded-xl border">
                  <h4 className="font-semibold text-foreground mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year Range</span>
                      <span className="font-medium text-foreground">
                        {filters.yearRange[0]} - {filters.yearRange[1]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Filtered Records</span>
                      <span className="font-medium text-foreground">
                        {filteredData.length.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Filters</span>
                      <span className="font-medium text-foreground">
                        {filters.continents.length + filters.regions.length + filters.countries.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Charts Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Info Panel - Understanding the Correlation */}
              <InfoPanel 
                avgSugarConsumption={kpis.avgSugarConsumption}
                avgDiabetesPrevalence={kpis.avgDiabetesPrevalence}
                totalRecords={kpis.totalRecords}
              />

              {/* World Map */}
              <WorldMapChart data={filteredData} />

              {/* Line and Bar Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TrendLineChart data={filteredData} />
                <ContinentBarChart data={filteredData} />
              </div>

              {/* Pie and Scatter Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SugarSourcePieChart data={filteredData} />
                <CorrelationScatterChart data={filteredData} />
              </div>

              {/* Region Bar Chart */}
              <RegionBarChart data={filteredData} />

              {/* Data Table */}
              <DataTable data={filteredData} />
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </>
  );
};

export default Index;
