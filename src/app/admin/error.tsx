"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-serif text-white">Algo deu errado!</h2>
                <p className="text-white/40 max-w-md mx-auto">
                    Não foi possível carregar os dados necessários. Isso pode ser um problema temporário de conexão.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <p className="text-red-400 font-mono text-xs bg-black/50 p-2 rounded">
                        {error.message}
                    </p>
                )}
            </div>

            <button
                onClick={reset}
                className="px-6 py-2 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors"
            >
                Tentar Novamente
            </button>
        </div>
    );
}





