import { DataRecord, FilterState, KPIData } from '@/types/dashboard';

export const getUniqueValues = (data: DataRecord[], key: keyof DataRecord): string[] => {
  const values = new Set(data.map((d) => String(d[key])));
  return Array.from(values).sort();
};

export const getYearRange = (data: DataRecord[]): [number, number] => {
  const years = data.map((d) => d.Year).filter((y) => !isNaN(y));
  return [Math.min(...years), Math.max(...years)];
};

export const filterData = (data: DataRecord[], filters: FilterState): DataRecord[] => {
  return data.filter((record) => {
    const yearMatch = record.Year >= filters.yearRange[0] && record.Year <= filters.yearRange[1];
    const continentMatch = filters.continents.length === 0 || filters.continents.includes(record.Continent);
    const regionMatch = filters.regions.length === 0 || filters.regions.includes(record.Region);
    const countryMatch = filters.countries.length === 0 || filters.countries.includes(record.Country);
    
    return yearMatch && continentMatch && regionMatch && countryMatch;
  });
};

export const calculateKPIs = (data: DataRecord[]): KPIData => {
  if (data.length === 0) {
    return {
      totalCountries: 0,
      avgDiabetesPrevalence: 0,
      avgSugarConsumption: 0,
      avgObesityRate: 0,
      totalRecords: 0,
      avgGDP: 0,
    };
  }

  const uniqueCountries = new Set(data.map((d) => d.Country));
  const avgDiabetes = data.reduce((sum, d) => sum + (d.Diabetes_Prevalence || 0), 0) / data.length;
  const avgSugar = data.reduce((sum, d) => sum + (d.Per_Capita_Sugar_Consumption || 0), 0) / data.length;
  const avgObesity = data.reduce((sum, d) => sum + (d.Obesity_Rate || 0), 0) / data.length;
  const avgGDP = data.reduce((sum, d) => sum + (d.GDP_Per_Capita || 0), 0) / data.length;

  return {
    totalCountries: uniqueCountries.size,
    avgDiabetesPrevalence: avgDiabetes,
    avgSugarConsumption: avgSugar,
    avgObesityRate: avgObesity,
    totalRecords: data.length,
    avgGDP: avgGDP,
  };
};

export const aggregateByYear = (data: DataRecord[]) => {
  const grouped = data.reduce((acc, record) => {
    const year = record.Year;
    if (!acc[year]) {
      acc[year] = { 
        count: 0, 
        diabetesSum: 0, 
        sugarSum: 0,
        obesitySum: 0 
      };
    }
    acc[year].count++;
    acc[year].diabetesSum += record.Diabetes_Prevalence || 0;
    acc[year].sugarSum += record.Per_Capita_Sugar_Consumption || 0;
    acc[year].obesitySum += record.Obesity_Rate || 0;
    return acc;
  }, {} as Record<number, { count: number; diabetesSum: number; sugarSum: number; obesitySum: number }>);

  return Object.entries(grouped)
    .map(([year, vals]) => ({
      year: parseInt(year),
      avgDiabetes: vals.diabetesSum / vals.count,
      avgSugar: vals.sugarSum / vals.count,
      avgObesity: vals.obesitySum / vals.count,
    }))
    .sort((a, b) => a.year - b.year);
};

export const aggregateByContinent = (data: DataRecord[]) => {
  const grouped = data.reduce((acc, record) => {
    const continent = record.Continent;
    if (!acc[continent]) {
      acc[continent] = { 
        count: 0, 
        diabetesSum: 0, 
        sugarSum: 0,
        obesitySum: 0 
      };
    }
    acc[continent].count++;
    acc[continent].diabetesSum += record.Diabetes_Prevalence || 0;
    acc[continent].sugarSum += record.Per_Capita_Sugar_Consumption || 0;
    acc[continent].obesitySum += record.Obesity_Rate || 0;
    return acc;
  }, {} as Record<string, { count: number; diabetesSum: number; sugarSum: number; obesitySum: number }>);

  return Object.entries(grouped)
    .map(([continent, vals]) => ({
      continent,
      avgDiabetes: vals.diabetesSum / vals.count,
      avgSugar: vals.sugarSum / vals.count,
      avgObesity: vals.obesitySum / vals.count,
      records: vals.count,
    }))
    .sort((a, b) => b.avgDiabetes - a.avgDiabetes);
};

export const aggregateByRegion = (data: DataRecord[]) => {
  const grouped = data.reduce((acc, record) => {
    const region = record.Region;
    if (!acc[region]) {
      acc[region] = { 
        count: 0, 
        diabetesSum: 0, 
        sugarSum: 0 
      };
    }
    acc[region].count++;
    acc[region].diabetesSum += record.Diabetes_Prevalence || 0;
    acc[region].sugarSum += record.Per_Capita_Sugar_Consumption || 0;
    return acc;
  }, {} as Record<string, { count: number; diabetesSum: number; sugarSum: number }>);

  return Object.entries(grouped)
    .map(([region, vals]) => ({
      region,
      avgDiabetes: vals.diabetesSum / vals.count,
      avgSugar: vals.sugarSum / vals.count,
      records: vals.count,
    }))
    .sort((a, b) => b.avgDiabetes - a.avgDiabetes);
};

export const getSugarSourceBreakdown = (data: DataRecord[]) => {
  const totals = data.reduce(
    (acc, record) => {
      acc.sugarcane += Math.max(0, record.Sugar_From_Sugarcane || 0);
      acc.beet += Math.max(0, record.Sugar_From_Beet || 0);
      acc.hfcs += Math.max(0, record.Sugar_From_HFCS || 0);
      acc.other += Math.max(0, Math.abs(record.Sugar_From_Other || 0));
      return acc;
    },
    { sugarcane: 0, beet: 0, hfcs: 0, other: 0 }
  );

  const total = totals.sugarcane + totals.beet + totals.hfcs + totals.other;
  
  return [
    { name: 'Sugarcane', value: (totals.sugarcane / total) * 100, color: 'hsl(var(--chart-1))' },
    { name: 'Beet', value: (totals.beet / total) * 100, color: 'hsl(var(--chart-2))' },
    { name: 'HFCS', value: (totals.hfcs / total) * 100, color: 'hsl(var(--chart-3))' },
    { name: 'Other', value: (totals.other / total) * 100, color: 'hsl(var(--chart-4))' },
  ];
};

export const getCorrelationData = (data: DataRecord[]) => {
  return data
    .filter(d => d.Per_Capita_Sugar_Consumption > 0 && d.Diabetes_Prevalence > 0)
    .slice(0, 500) // Limit for performance
    .map((record) => ({
      sugarConsumption: record.Per_Capita_Sugar_Consumption,
      diabetesPrevalence: record.Diabetes_Prevalence,
      country: record.Country,
      continent: record.Continent,
    }));
};

export const aggregateByCountry = (data: DataRecord[]) => {
  const grouped = data.reduce((acc, record) => {
    const country = record.Country;
    if (!acc[country]) {
      acc[country] = { 
        count: 0, 
        diabetesSum: 0, 
        sugarSum: 0,
        code: record.Country_Code,
        continent: record.Continent
      };
    }
    acc[country].count++;
    acc[country].diabetesSum += record.Diabetes_Prevalence || 0;
    acc[country].sugarSum += record.Per_Capita_Sugar_Consumption || 0;
    return acc;
  }, {} as Record<string, { count: number; diabetesSum: number; sugarSum: number; code: string; continent: string }>);

  return Object.entries(grouped)
    .map(([country, vals]) => ({
      country,
      code: vals.code,
      continent: vals.continent,
      avgDiabetes: vals.diabetesSum / vals.count,
      avgSugar: vals.sugarSum / vals.count,
      records: vals.count,
    }))
    .sort((a, b) => b.avgDiabetes - a.avgDiabetes);
};
