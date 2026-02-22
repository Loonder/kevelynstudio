"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Music, Coffee, Thermometer, Volume2, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { updateClientPreferences } from "@/actions/profile-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SensoryPreferences = {
    favoriteMusic?: string;
    drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
    temperature?: "Warm" | "Cool" | "Neutral";
    musicVolume?: "Soft" | "Medium" | "Deep";
};

interface ProfilePreferencesFormProps {
    clientId: string;
    currentPreferences?: SensoryPreferences | null;
}

export function ProfilePreferencesForm({ clientId, currentPreferences }: ProfilePreferencesFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [preferences, setPreferences] = useState<SensoryPreferences>({
        favoriteMusic: currentPreferences?.favoriteMusic || "",
        drinkPreference: currentPreferences?.drinkPreference || "None",
        temperature: currentPreferences?.temperature || "Neutral",
        musicVolume: currentPreferences?.musicVolume || "Medium",
    });

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updateClientPreferences(clientId, preferences);

            if (result.success) {
                toast.success("Preferências salvas com sucesso!");
                router.refresh();
            } else {
                toast.error(result.error || "Erro ao salvar preferências");
            }
        } catch (error) {
            toast.error("Erro ao salvar preferências");
        } finally {
            setIsLoading(false);
        }
    };

    const drinks = [
        { value: "Water", label: "Água", icon: "💧" },
        { value: "Coffee", label: "Café", icon: "☕" },
        { value: "Champagne", label: "Espumante", icon: "🥂" },
        { value: "Tea", label: "Chá", icon: "🍵" },
        { value: "None", label: "Nenhuma", icon: "🚫" },
    ];

    const temperatures = ["Warm", "Cool", "Neutral"];
    const volumes = ["Soft", "Medium", "Deep"];

    return (
        <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-white">Minhas Preferências</h2>
                        <p className="text-xs text-white/40 mt-1">Personalize sua experiência (opcional)</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Favorite Music */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-3">
                        <Music className="w-4 h-4" />
                        Música Favorita
                    </label>
                    <input
                        type="text"
                        value={preferences.favoriteMusic || ""}
                        onChange={(e) => setPreferences({ ...preferences, favoriteMusic: e.target.value })}
                        placeholder="Ex: Jazz, Bossa Nova, Pop..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-primary outline-none transition-colors"
                    />
                </div>

                {/* Drink Preference */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-3">
                        <Coffee className="w-4 h-4" />
                        Bebida Preferida
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {drinks.map((drink) => (
                            <button
                                key={drink.value}
                                type="button"
                                onClick={() => setPreferences({ ...preferences, drinkPreference: drink.value as any })}
                                className={cn(
                                    "p-4 rounded-xl border text-sm transition-all flex flex-col items-center gap-2",
                                    preferences.drinkPreference === drink.value
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                )}
                            >
                                <span className="text-2xl">{drink.icon}</span>
                                <span>{drink.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Temperature */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-3">
                        <Thermometer className="w-4 h-4" />
                        Temperatura Ambiente
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {temperatures.map((temp) => (
                            <button
                                key={temp}
                                type="button"
                                onClick={() => setPreferences({ ...preferences, temperature: temp as any })}
                                className={cn(
                                    "p-3 rounded-xl border text-sm transition-all",
                                    preferences.temperature === temp
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                )}
                            >
                                {temp === "Warm" ? "Quente" : temp === "Cool" ? "Frio" : "Neutro"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Music Volume */}
                <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-3">
                        <Volume2 className="w-4 h-4" />
                        Volume da Música
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {volumes.map((vol) => (
                            <button
                                key={vol}
                                type="button"
                                onClick={() => setPreferences({ ...preferences, musicVolume: vol as any })}
                                className={cn(
                                    "p-3 rounded-xl border text-sm transition-all",
                                    preferences.musicVolume === vol
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                )}
                            >
                                {vol === "Soft" ? "Suave" : vol === "Medium" ? "Médio" : "Alto"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-8">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary text-black px-8 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 mx-auto"
                >
                    {isLoading ? (
                        <>Salvando...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Salvar Preferências
                        </>
                    )}
                </button>
                <p className="text-xs text-white/30 text-center mt-4">
                    Suas preferências serão usadas para tornar sua visita ainda mais especial
                </p>
            </div>
        </GlassCard>
    );
}





