
import { ServiceForm } from "@/components/admin/services/service-form";

export default function NewServicePage() {
    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-serif text-white mb-2">Novo Serviço</h2>
                <p className="text-white/50">Adicione um novo procedimento ao menu do Studio.</p>
            </header>
            <ServiceForm />
        </div>
    );
}
