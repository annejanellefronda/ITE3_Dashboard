export interface DataRecord {
  Country: string;
  Year: number;
  Country_Code: string;
  Continent: string;
  Region: string;
  Population: number;
  GDP_Per_Capita: number;
  Per_Capita_Sugar_Consumption: number;
  Total_Sugar_Consumption: number;
  Sugar_From_Sugarcane: number;
  Sugar_From_Beet: number;
  Sugar_From_HFCS: number;
  Sugar_From_Other: number;
  Processed_Food_Consumption: number;
  Avg_Daily_Sugar_Intake: number;
  Diabetes_Prevalence: number;
  Obesity_Rate: number;
  Sugar_Imports: number;
  Sugar_Exports: number;
  Avg_Retail_Price_Per_Kg: number;
  Gov_Tax: number;
  Gov_Subsidies: number;
  Education_Campaign: number;
  Urbanization_Rate: number;
  Climate_Conditions: number;
  Sugarcane_Production_Yield: number;
}

export interface FilterState {
  yearRange: [number, number];
  continents: string[];
  regions: string[];
  countries: string[];
}

export interface KPIData {
  totalCountries: number;
  avgDiabetesPrevalence: number;
  avgSugarConsumption: number;
  avgObesityRate: number;
  totalRecords: number;
  avgGDP: number;
}
