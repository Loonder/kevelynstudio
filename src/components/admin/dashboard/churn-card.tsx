
import { MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChurnCardProps {
    clients: {
        id: string;
        name: string;
        phone: string;
        lastVisit: Date | null;
    }[];
}

export function ChurnRiskCard({ clients }: ChurnCardProps) {
    if (clients.length === 0) return null;

    return (
        <GlassCard className="p-0 overflow-hidden border-orange-500/20">
            <div className="p-6 border-b border-white/5 bg-orange-500/5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">⚠️</span>
                    <h3 className="text-lg font-serif text-white">Risco de Churn</h3>
                </div>
                <p className="text-white/40 text-xs">Clientes ausentes há 45+ dias</p>
            </div>

            <div className="divide-y divide-white/5">
                {clients.map(client => {
                    const daysAway = client.lastVisit
                        ? formatDistanceToNow(new Date(client.lastVisit), { locale: ptBR })
                        : "muito tempo";

                    const message = `Olá ${client.name.split(' ')[0]}! Tudo bem? Sentimos sua falta aqui no Kevelyn Studio. Que tal agendarmos um momento de cuidado para você essa semana? ✨`;
                    const whatsappLink = `https://wa.me/55${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

                    return (
                        <div key={client.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div>
                                <p className="text-white text-sm font-medium">{client.name}</p>
                                <p className="text-white/30 text-xs">Última vez: {daysAway} atrás</p>
                            </div>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/5 hover:bg-green-500/20 text-white/50 hover:text-green-400 p-2 rounded-full transition-all"
                                title="Enviar mensagem de recuperação"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                    )
                })}
            </div>
            <div className="p-3 text-center bg-white/5">
                <p className="text-xs text-white/30">Total: {clients.length} clientes em risco</p>
            </div>
        </GlassCard>
    );
}
