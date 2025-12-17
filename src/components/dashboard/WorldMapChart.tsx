import { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Tooltip as MapTooltip,
} from 'react-simple-maps';
import { DataRecord } from '@/types/dashboard';
import { aggregateByCountry } from '@/utils/dataUtils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

interface WorldMapChartProps {
  data: DataRecord[];
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const getColor = (value: number) => {
  if (value >= 12) return 'hsl(0, 72%, 51%)';      // High - Red
  if (value >= 10) return 'hsl(12, 76%, 61%)';    // Medium-High - Coral
  if (value >= 8) return 'hsl(45, 93%, 47%)';     // Medium - Yellow
  if (value >= 6) return 'hsl(174, 62%, 50%)';    // Low-Medium - Teal
  return 'hsl(174, 62%, 70%)';                     // Low - Light Teal
};

const countryNameMap: Record<string, string[]> = {
  'USA': ['United States of America', 'United States'],
  'Russia': ['Russian Federation', 'Russia'],
  'South Korea': ['Korea, Republic of', 'South Korea'],
  'UK': ['United Kingdom', 'UK', 'Great Britain'],
};

export const WorldMapChart = ({ data }: WorldMapChartProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  const countryData = useMemo(() => {
    const aggregated = aggregateByCountry(data);
    const map: Record<string, { avgDiabetes: number; avgSugar: number }> = {};
    
    aggregated.forEach((item) => {
      map[item.country] = {
        avgDiabetes: item.avgDiabetes,
        avgSugar: item.avgSugar,
      };
      
      // Add alternate names
      const alternates = countryNameMap[item.country];
      if (alternates) {
        alternates.forEach((name) => {
          map[name] = {
            avgDiabetes: item.avgDiabetes,
            avgSugar: item.avgSugar,
          };
        });
      }
    });
    
    return map;
  }, [data]);

  return (
    <div className="chart-card animate-slide-up">
      <h3 className="chart-title">Global Diabetes Prevalence Map</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Low</span>
          <div className="flex h-3">
            <div className="w-6 h-full" style={{ backgroundColor: 'hsl(174, 62%, 70%)' }} />
            <div className="w-6 h-full" style={{ backgroundColor: 'hsl(174, 62%, 50%)' }} />
            <div className="w-6 h-full" style={{ backgroundColor: 'hsl(45, 93%, 47%)' }} />
            <div className="w-6 h-full" style={{ backgroundColor: 'hsl(12, 76%, 61%)' }} />
            <div className="w-6 h-full" style={{ backgroundColor: 'hsl(0, 72%, 51%)' }} />
          </div>
          <span>High</span>
        </div>
        <span className="text-xs text-muted-foreground">(Diabetes Prevalence %)</span>
      </div>
      <div className="h-[400px] relative">
        <ComposableMap
          projectionConfig={{
            scale: 140,
            center: [0, 20],
          }}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const countryInfo = countryData[countryName];
                const fillColor = countryInfo
                  ? getColor(countryInfo.avgDiabetes)
                  : 'hsl(var(--muted))';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        outline: 'none',
                        fill: 'hsl(var(--primary))',
                        cursor: 'pointer',
                      },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        
        {hoveredCountry && countryData[hoveredCountry] && (
          <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg">
            <p className="font-semibold text-foreground">{hoveredCountry}</p>
            <p className="text-sm text-muted-foreground">
              Diabetes: {countryData[hoveredCountry].avgDiabetes.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Sugar: {countryData[hoveredCountry].avgSugar.toFixed(2)} kg/capita
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
