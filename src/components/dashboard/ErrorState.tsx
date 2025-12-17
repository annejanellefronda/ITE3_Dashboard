import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <p className="mt-4 text-lg font-medium text-foreground">Error Loading Data</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="mt-4">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
