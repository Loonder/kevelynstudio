import { BotConnectivity } from "@/components/admin/concierge/bot-connectivity";
import { BotConfigEditor } from "@/components/admin/concierge/bot-config-editor";

export default function ConciergePage() {
    return (
        <div className="p-8 space-y-16 bg-black min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-serif text-white mb-2">
                    Secretária <span className="text-primary italic">Online</span>
                </h1>
                <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Gestão de IA e Conectividade</p>
            </div>

            <BotConnectivity />

            <div className="border-t border-white/5 pt-16">
                <BotConfigEditor />
            </div>
        </div>
    );
}





