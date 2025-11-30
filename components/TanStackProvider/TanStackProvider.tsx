'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface TanStackProviderProps {
  children: ReactNode;
}

// Створюємо QueryClient один раз
const queryClient = new QueryClient();

export default function TanStackProvider({ children }: TanStackProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
