
import React from 'react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="font-serif text-4xl md:text-5xl text-white mb-12">Política de Privacidade</h1>
                <div className="prose prose-invert prose-lg text-white/70 font-light space-y-8">
                    <p>
                        Na Kevelyn Company, a sua privacidade é tão valiosa quanto a sua confiança.
                        Esta política descreve como tratamos as suas informações pessoais com o máximo rigor e discrição.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-8 mb-4">1. Coleta de Informações</h3>
                    <p>
                        Coletamos apenas as informações essenciais para proporcionar uma experiência de concierge excepcional.
                        Isso inclui dados fornecidos durante o agendamento de atendimentos ou inscrição em nossa newsletter.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-8 mb-4">2. Uso das Informações</h3>
                    <p>
                        Seus dados são utilizados exclusivamente para personalizar o seu atendimento, gerenciar agendamentos
                        e comunicar novidades exclusivas. Jamais compartilhamos suas informações com terceiros não autorizados.
                    </p>

                    <h3 className="text-white font-serif text-2xl mt-8 mb-4">3. Segurança</h3>
                    <p>
                        Empregamos padrões de segurança de nível empresarial para proteger seus dados contra acesso não autorizado.
                        Nossa infraestrutura digital é monitorada constantemente para garantir a sua tranquilidade.
                    </p>

                    <p className="mt-12 text-sm text-white/40 border-t border-white/10 pt-8">
                        Última atualização: Fevereiro de 2026.
                    </p>
                </div>
            </div>
        </main>
    );
}





