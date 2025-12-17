import { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataRecord, FilterState } from '@/types/dashboard';
import { getUniqueValues, getYearRange } from '@/utils/dataUtils';

interface FilterPanelProps {
  data: DataRecord[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const FilterPanel = ({ data, filters, onFiltersChange }: FilterPanelProps) => {
  const yearRange = useMemo(() => getYearRange(data), [data]);
  const continents = useMemo(() => getUniqueValues(data, 'Continent'), [data]);
  const regions = useMemo(() => getUniqueValues(data, 'Region'), [data]);
  const countries = useMemo(() => getUniqueValues(data, 'Country'), [data]);

  const handleYearChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      yearRange: [values[0], values[1]],
    });
  };

  const handleContinentChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, continents: [], regions: [], countries: [] });
    } else {
      onFiltersChange({
        ...filters,
        continents: [value],
        regions: [],
        countries: [],
      });
    }
  };

  const handleRegionChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, regions: [], countries: [] });
    } else {
      onFiltersChange({
        ...filters,
        regions: [value],
        countries: [],
      });
    }
  };

  const handleCountryChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, countries: [] });
    } else {
      onFiltersChange({
        ...filters,
        countries: [value],
      });
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      yearRange: yearRange,
      continents: [],
      regions: [],
      countries: [],
    });
  };

  const hasActiveFilters =
    filters.continents.length > 0 ||
    filters.regions.length > 0 ||
    filters.countries.length > 0 ||
    filters.yearRange[0] !== yearRange[0] ||
    filters.yearRange[1] !== yearRange[1];

  // Filter regions based on selected continent
  const filteredRegions = useMemo(() => {
    if (filters.continents.length === 0) return regions;
    return getUniqueValues(
      data.filter((d) => filters.continents.includes(d.Continent)),
      'Region'
    );
  }, [data, filters.continents, regions]);

  // Filter countries based on selected region
  const filteredCountries = useMemo(() => {
    let filtered = data;
    if (filters.continents.length > 0) {
      filtered = filtered.filter((d) => filters.continents.includes(d.Continent));
    }
    if (filters.regions.length > 0) {
      filtered = filtered.filter((d) => filters.regions.includes(d.Region));
    }
    return getUniqueValues(filtered, 'Country');
  }, [data, filters.continents, filters.regions]);

  return (
    <div className="filter-section animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {/* Year Range Slider */}
        <div>
          <label className="filter-label">
            Year Range: {filters.yearRange[0]} - {filters.yearRange[1]}
          </label>
          <Slider
            min={yearRange[0]}
            max={yearRange[1]}
            step={1}
            value={filters.yearRange}
            onValueChange={handleYearChange}
            className="mt-3"
          />
        </div>

        {/* Continent Select */}
        <div>
          <label className="filter-label">Continent</label>
          <Select
            value={filters.continents[0] || 'all'}
            onValueChange={handleContinentChange}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Continents" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Continents</SelectItem>
              {continents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Select */}
        <div>
          <label className="filter-label">Region</label>
          <Select
            value={filters.regions[0] || 'all'}
            onValueChange={handleRegionChange}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Regions</SelectItem>
              {filteredRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Select */}
        <div>
          <label className="filter-label">Country</label>
          <Select
            value={filters.countries[0] || 'all'}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent className="bg-popover max-h-60">
              <SelectItem value="all">All Countries</SelectItem>
              {filteredCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.continents.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {c}
                </Badge>
              ))}
              {filters.regions.map((r) => (
                <Badge key={r} variant="secondary" className="text-xs">
                  {r}
                </Badge>
              ))}
              {filters.countries.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
