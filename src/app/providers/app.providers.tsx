import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { MonitoredPointsProvider } from '@/app/providers/monitored-points.provider';
import { queryClient } from '@/app/providers/query-client.provider';
import { appRouter } from '@/app/router';

export const AppProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MonitoredPointsProvider>
        <RouterProvider router={appRouter} />
      </MonitoredPointsProvider>
    </QueryClientProvider>
  );
};
