import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DataRecord } from '@/types/dashboard';
import { aggregateByCountry } from '@/utils/dataUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps {
  data: DataRecord[];
}

const ITEMS_PER_PAGE = 10;

export const DataTable = ({ data }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const tableData = useMemo(() => aggregateByCountry(data), [data]);
  
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = tableData.slice(startIndex, endIndex);

  return (
    <div className="chart-card animate-slide-up">
      <h3 className="chart-title">Country Statistics Summary</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Country</TableHead>
              <TableHead className="text-muted-foreground">Continent</TableHead>
              <TableHead className="text-muted-foreground text-right">Avg Diabetes (%)</TableHead>
              <TableHead className="text-muted-foreground text-right">Avg Sugar (kg/capita)</TableHead>
              <TableHead className="text-muted-foreground text-right">Records</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.country} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">{row.country}</TableCell>
                <TableCell className="text-muted-foreground">{row.continent}</TableCell>
                <TableCell className="text-right font-mono text-foreground">
                  {row.avgDiabetes.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-mono text-foreground">
                  {row.avgSugar.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {row.records}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, tableData.length)} of {tableData.length} countries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
