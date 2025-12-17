import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-lg font-medium text-foreground">Loading Dashboard...</p>
        <p className="text-sm text-muted-foreground mt-2">Processing 10,000+ health records</p>
      </div>
    </div>
  );
};
