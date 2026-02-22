import { createClient } from "@/lib/supabase/server";
import { supabase as supabaseAdmin } from "@/lib/supabase-client";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import PublicLayout from "@/components/layout/PublicLayout";
import { ProfilePreferencesForm } from "@/components/features/profile/profile-preferences-form";
import { User, Phone, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TENANT_ID = process.env.TENANT_ID || 'kevelyn_studio';

export default async function ProfilePage() {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Client Profile from unified 'contacts' table
    const { data: client } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .eq('auth_user_id', user.id)
        .eq('tenant_id', TENANT_ID)
        .single();

    if (!client) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-white">Perfil de cliente não encontrado. Entre em contato com o suporte.</p>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="pt-10 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-serif text-white mb-2">
                            Meu Perfil
                        </h1>
                        <p className="text-white/40 uppercase text-xs tracking-widest">
                            Gerencie suas informações e preferências
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* Personal Information Card */}
                        <GlassCard className="p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                                    <User className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                                <h2 className="text-xl font-serif text-white">Informações Pessoais</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-white/40 mb-2 block">Nome Completo</label>
                                    <div className="flex items-center gap-2 text-white">
                                        <User className="w-4 h-4 text-white/40" />
                                        <span>{client.full_name}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-wider text-white/40 mb-2 block">E-mail</label>
                                    <div className="flex items-center gap-2 text-white">
                                        <Mail className="w-4 h-4 text-white/40" />
                                        <span>{client.email}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-wider text-white/40 mb-2 block">Telefone</label>
                                    <div className="flex items-center gap-2 text-white">
                                        <Phone className="w-4 h-4 text-white/40" />
                                        <span>{client.phone || "Não informado"}</span>
                                    </div>
                                </div>

                                {client.birth_date && (
                                    <div>
                                        <label className="text-xs uppercase tracking-wider text-white/40 mb-2 block">Data de Nascimento</label>
                                        <div className="flex items-center gap-2 text-white">
                                            <Calendar className="w-4 h-4 text-white/40" />
                                            <span>{format(new Date(client.birth_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-white/30 mt-6 italic">
                                Para atualizar nome ou e-mail, entre em contato com nossa equipe.
                            </p>
                        </GlassCard>

                        {/* Preferences Card */}
                        <ProfilePreferencesForm
                            clientId={client.id}
                            currentPreferences={client.sensory_preferences}
                        />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}





