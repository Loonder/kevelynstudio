"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getClientById, updateClient } from "@/actions/client-actions";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, User, Coffee, Music, Thermometer, Volume2 } from "lucide-react";
import Link from "next/link";

interface ClientForm {
    fullName: string;
    email: string;
    phone: string;
    notes: string;
    sensoryPreferences: {
        favoriteMusic?: string;
        drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
        temperature?: "Warm" | "Cool" | "Neutral";
        musicVolume?: "Soft" | "Medium" | "Deep";
    };
}

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState<ClientForm>({
        fullName: "",
        email: "",
        phone: "",
        notes: "",
        sensoryPreferences: {
            drinkPreference: "None",
            temperature: "Neutral",
            musicVolume: "Medium"
        }
    });

    useEffect(() => {
        async function load() {
            const raw = await getClientById(id);
            const res = raw as any;
            if (res) {
                // Merge sensory preferences with defaults
                setData({
                    fullName: res.fullName || "",
                    email: res.email || "",
                    phone: res.phone || "",
                    notes: res.notes || "",
                    sensoryPreferences: {
                        favoriteMusic: res.sensoryPreferences?.favoriteMusic || "",
                        drinkPreference: res.sensoryPreferences?.drinkPreference || "None",
                        temperature: res.sensoryPreferences?.temperature || "Neutral",
                        musicVolume: res.sensoryPreferences?.musicVolume || "Medium",
                    }
                });
            } else {
                toast.error("Cliente não encontrado.");
                router.push("/admin/clients");
            }
            setIsLoading(false);
        }
        load();
    }, [id, router]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await updateClient(id, data);
        if (res.success) {
            toast.success("Cliente atualizado com sucesso!");
            router.push("/admin/clients");
        } else {
            toast.error(res.error || "Erro ao salvar.");
        }
        setIsSaving(false);
    };

    if (isLoading) return <div className="p-10 text-white">Carregando dados do cliente...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <Link href="/admin/clients" className="flex items-center text-white/50 hover:text-[#D4AF37] transition-colors mb-6 w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Lista
            </Link>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Editar Cliente</h1>
                    <p className="text-white/50">Personalize a experiência do cliente</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                    <User className="w-8 h-8 text-[#D4AF37]" />
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">

                {/* Basic Info */}
                <section className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-serif text-white mb-6 border-b border-white/5 pb-4">
                        Informações Pessoais
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Nome Completo</label>
                            <Input
                                value={data.fullName}
                                onChange={e => setData({ ...data, fullName: e.target.value })}
                                className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                            <Input
                                value={data.email}
                                onChange={e => setData({ ...data, email: e.target.value })}
                                className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50">Telefone</label>
                            <Input
                                value={data.phone}
                                onChange={e => setData({ ...data, phone: e.target.value })}
                                className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]/50"
                            />
                        </div>
                    </div>
                </section>

                {/* Sensory Preferences */}
                <section className="bg-gradient-to-br from-black/40 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <User className="w-32 h-32 text-[#D4AF37]" />
                    </div>

                    <h2 className="text-xl font-serif text-[#D4AF37] mb-6 border-b border-[#D4AF37]/20 pb-4 flex items-center gap-2">
                        Preferências Sensoriais & Experiência
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {/* Drink */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-white/70 flex items-center gap-2">
                                <Coffee className="w-3 h-3 text-[#D4AF37]" /> Bebida Favorita
                            </label>
                            <select
                                value={data.sensoryPreferences.drinkPreference}
                                onChange={e => setData({
                                    ...data,
                                    sensoryPreferences: { ...data.sensoryPreferences, drinkPreference: e.target.value as any }
                                })}
                                className="w-full bg-black/60 border border-white/10 text-white rounded-md p-3 focus:outline-none focus:border-[#D4AF37] transition-all"
                            >
                                <option value="None">Nenhuma</option>
                                <option value="Water">Água Premium</option>
                                <option value="Coffee">Café Espresso</option>
                                <option value="Champagne">Champagne</option>
                                <option value="Tea">Chá Calmante</option>
                            </select>
                        </div>

                        {/* Temperature */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-white/70 flex items-center gap-2">
                                <Thermometer className="w-3 h-3 text-[#D4AF37]" /> Temperatura Sala
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {["Cool", "Neutral", "Warm"].map((temp) => (
                                    <button
                                        key={temp}
                                        type="button"
                                        onClick={() => setData({
                                            ...data,
                                            sensoryPreferences: { ...data.sensoryPreferences, temperature: temp as any }
                                        })}
                                        className={`p-2 text-sm rounded border transition-all ${data.sensoryPreferences.temperature === temp
                                            ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold"
                                            : "bg-transparent text-white/50 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {temp === "Cool" ? "❄️ Frio" : temp === "Neutral" ? "✨ Neutro" : "🔥 Quente"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Music Volume */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-white/70 flex items-center gap-2">
                                <Volume2 className="w-3 h-3 text-[#D4AF37]" /> Volume Música
                            </label>
                            <select
                                value={data.sensoryPreferences.musicVolume}
                                onChange={e => setData({
                                    ...data,
                                    sensoryPreferences: { ...data.sensoryPreferences, musicVolume: e.target.value as any }
                                })}
                                className="w-full bg-black/60 border border-white/10 text-white rounded-md p-3 focus:outline-none focus:border-[#D4AF37] transition-all"
                            >
                                <option value="Soft">Suave (Fundo)</option>
                                <option value="Medium">Médio (Ambiente)</option>
                                <option value="Deep">Imersivo (Alto)</option>
                            </select>
                        </div>

                        {/* Music Genre */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-white/70 flex items-center gap-2">
                                <Music className="w-3 h-3 text-[#D4AF37]" /> Estilo Musical
                            </label>
                            <Input
                                placeholder="Ex: Jazz, MPB, Pop..."
                                value={data.sensoryPreferences.favoriteMusic}
                                onChange={e => setData({
                                    ...data,
                                    sensoryPreferences: { ...data.sensoryPreferences, favoriteMusic: e.target.value }
                                })}
                                className="bg-black/60 border-white/10 text-white focus:border-[#D4AF37]/50"
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-6 flex justify-end">
                    <LuxuryButton
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#D4AF37] text-black hover:bg-[#b5952f] px-10 py-6 text-lg"
                    >
                        {isSaving ? "Salvando..." : (
                            <>
                                <Save className="w-5 h-5 mr-3" /> Salvar Alterações
                            </>
                        )}
                    </LuxuryButton>
                </div>
            </form>
        </div>
    );
}
