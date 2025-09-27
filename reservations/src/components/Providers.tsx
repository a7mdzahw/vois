'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/nextjs';
import { useState } from 'react';

import { ToastProvider } from '@heroui/react';
import { ConfirmProvider } from './ConfirmDialog';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider />
        <ConfirmProvider>{children}</ConfirmProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
