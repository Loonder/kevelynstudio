import { Music, Coffee, Thermometer, User } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface SensoryProfileProps {
    preferences: {
        favoriteMusic?: string;
        drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
        temperature?: "Warm" | "Cool" | "Neutral";
        musicVolume?: "Soft" | "Medium" | "Deep";
    } | null;
}

export function SensoryProfileCard({ preferences }: SensoryProfileProps) {
    if (!preferences) {
        return (
            <GlassCard className="p-6 border-yellow-500/20 bg-zinc-900/50">
                <h3 className="text-xl font-serif text-white mb-4">Experiência Sensorial</h3>
                <p className="text-white/50 italic">Preferências não configuradas pelo cliente.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6 border-yellow-500/30 bg-zinc-900/50 relative overflow-hidden">
            <h3 className="text-xl font-serif text-[#D4AF37] mb-6 flex items-center gap-2">
                Experiência Sensorial
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent ml-4" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Vibe Musical */}
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                        <Music className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-1">Vibe Musical</span>
                        <p className="text-white font-medium text-lg">{preferences.favoriteMusic || "Não informado"}</p>
                        <span className="text-xs text-white/40">{preferences.musicVolume === 'Deep' ? '(Imersivo)' : preferences.musicVolume === 'Soft' ? '(Suave)' : '(Ambiente)'}</span>
                    </div>
                </div>

                {/* Bebida */}
                <div className="flex flex-col items-center text-center gap-3 border-x border-white/5">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                        <Coffee className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-1">Bebida</span>
                        <p className="text-white font-medium text-lg">
                            {preferences.drinkPreference === 'Water' ? 'Água Premium' :
                                preferences.drinkPreference === 'Coffee' ? 'Café Espresso' :
                                    preferences.drinkPreference === 'Champagne' ? 'Champagne' :
                                        preferences.drinkPreference === 'Tea' ? 'Chá Calmante' : 'Nenhuma'}
                        </p>
                    </div>
                </div>

                {/* Temperatura */}
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                        <Thermometer className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-1">Clima</span>
                        <p className="text-white font-medium text-lg">
                            {preferences.temperature === 'Cool' ? 'Frio (Ar Condicionado)' :
                                preferences.temperature === 'Warm' ? 'Aquecido / Manta' : 'Neutro'}
                        </p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}





