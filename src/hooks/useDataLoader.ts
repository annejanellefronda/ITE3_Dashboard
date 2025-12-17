import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { DataRecord } from '@/types/dashboard';

export const useDataLoader = () => {
  const [data, setData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/sugar_consumption_dataset.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data as DataRecord[];
            // Filter out any invalid records
            const validData = parsedData.filter(
              (record) => record.Country && record.Year && !isNaN(record.Year)
            );
            setData(validData);
            setLoading(false);
          },
          error: (err: Error) => {
            setError(err.message);
            setLoading(false);
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
