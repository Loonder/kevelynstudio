
import { ProfessionalForm } from "@/components/admin/professionals/professional-form";

export default function NewProfessionalPage() {
    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-serif text-white mb-2">Novo Talento</h2>
                <p className="text-white/50">Adicione uma nova profissional à equipe.</p>
            </header>
            <ProfessionalForm />
        </div>
    );
}





