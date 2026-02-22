import { supabase } from "@/lib/supabase-client";
import { GlassCard } from "@/components/ui/glass-card";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ProfessionalModal } from "@/components/admin/professionals/professional-modal";
import { ProfessionalStatusToggle } from "@/components/admin/professionals/professional-status-toggle";
import { DeleteProfessionalButton } from "@/components/admin/professionals/delete-professional-button";
import { Plus, User, Pencil } from "lucide-react";
import Image from "next/image";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function ProfessionalsPage() {
    const { data: staff } = await supabase
        .from('professionals')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2">Time de Especialistas</h1>
                    <p className="text-white/50 text-sm font-light">
                        Gerencie a disponibilidade e perfil da sua equipe.
                    </p>
                </div>

                <ProfessionalModal
                    trigger={
                        <LuxuryButton className="bg-[#D4AF37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Membro
                        </LuxuryButton>
                    }
                />
            </div>

            {/* Team Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(staff || []).map((pro) => (
                    <GlassCard key={pro.id} className="p-6 flex flex-col items-center text-center gap-4 group hover:border-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden">

                        {/* Color Dot Indicator */}
                        <div
                            className="absolute top-4 right-4 w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                            style={{ backgroundColor: pro.color || '#D4AF37', color: pro.color || '#D4AF37' }}
                            title="Cor da Agenda"
                        />

                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-transparent p-1 border border-white/10 shadow-2xl relative">
                            {pro.image_url ? (
                                <Image
                                    src={pro.image_url}
                                    alt={pro.name}
                                    fill
                                    className="object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center">
                                    <User className="w-10 h-10 text-white/20" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div>
                            <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">
                                {pro.name}
                            </h3>
                            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mt-1">
                                {pro.role}
                            </p>
                        </div>

                        {/* Bio / Stats */}
                        <p className="text-white/40 text-sm line-clamp-2 h-10 px-4">
                            {pro.bio || "Sem biografia definida."}
                        </p>

                        {/* Footer / Actions */}
                        <div className="mt-auto pt-6 w-full border-t border-white/5 flex items-center justify-between px-2">
                            <span className={`text-xs font-medium ${pro.is_active ? "text-green-400" : "text-white/30"}`}>
                                {pro.is_active ? "Ativo" : "Inativo"}
                            </span>
                            <div className="flex items-center gap-1">
                                <ProfessionalStatusToggle professional={pro} />

                                {/* Edit Button */}
                                <ProfessionalModal
                                    professional={pro}
                                    trigger={
                                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                                            <Pencil className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37]" />
                                        </button>
                                    }
                                />

                                {/* Delete Button */}
                                <DeleteProfessionalButton
                                    professionalId={pro.id}
                                    professionalName={pro.name}
                                />
                            </div>
                        </div>
                    </GlassCard>
                ))}

                {(!staff || staff.length === 0) && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-white/30 border border-dashed border-white/10 rounded-xl">
                        <p>Nenhum profissional encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}





