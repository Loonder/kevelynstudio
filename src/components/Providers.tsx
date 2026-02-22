"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    // Inicializa o cliente uma única vez dentro do Client Component
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minuto de cache padrão
                refetchOnWindowFocus: false, // Evita spam ao mudar de abas
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Devtools só irá aparecer durante o desenvolvimento, sem quebrar prod */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}





