"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views, View, Navigate } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { rescheduleAppointment } from "@/actions/calendar-actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CreateAppointmentModal } from "./create-appointment-modal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// Setup Localizer
const locales = {
    "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar as any) as any;

interface AdminCalendarProps {
    initialEvents: any[];
    resources: any[];
    clients: any[];
    services: any[];
}

// Custom Toolbar Component
const CustomToolbar = ({ onNavigate, onView, view, date, label }: any) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-6">
                <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/5">
                    <button
                        onClick={() => onNavigate(Navigate.PREVIOUS)}
                        className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-[#D4AF37] transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onNavigate(Navigate.TODAY)}
                        className="px-6 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all border-x border-white/5 mx-2"
                    >
                        Hoje
                    </button>
                    <button
                        onClick={() => onNavigate(Navigate.NEXT)}
                        className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-[#D4AF37] transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <h2 className="text-2xl font-serif text-white ml-2 capitalize tracking-wide hidden md:block">
                    {label}
                </h2>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex bg-black/40 rounded-full p-1 border border-white/5">
                    {['month', 'week', 'day'].map((v) => (
                        <button
                            key={v}
                            onClick={() => onView(v.toUpperCase())}
                            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300
                                ${view === v.toUpperCase()
                                    ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : 'Dia'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Custom Event Component
const CustomEvent = ({ event }: any) => {
    // Icon mapping based on category (simple string match)
    const getIcon = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('lash') || cat.includes('cílios')) return '👁️';
        if (cat.includes('brow') || cat.includes('sobrancelha')) return '✨';
        if (cat.includes('lip') || cat.includes('labial')) return '👄';
        return '📅';
    };

    return (
        <div className="flex flex-col h-full justify-center px-1">
            <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider truncate flex items-center gap-1">
                <span>{getIcon(event.category)}</span>
                {event.serviceTitle}
            </div>
            <div className="text-xs font-medium truncate">
                {event.clientName}
            </div>
        </div>
    );
};

export function AdminCalendar({ initialEvents, resources, clients, services }: AdminCalendarProps) {
    const [events, setEvents] = useState(initialEvents);
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    // Create Modal State
    const [createModal, setCreateModal] = useState<{
        isOpen: boolean;
        start: Date | null;
    }>({
        isOpen: false,
        start: null,
    });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        event: any | null;
        newStart: Date | null;
        newEnd: Date | null;
        resourceId: string | null;
    }>({
        isOpen: false,
        event: null,
        newStart: null,
        newEnd: null,
        resourceId: null,
    });

    const eventPropGetter = useCallback(
        (event: any) => {
            const hexColor = event.color || '#D4AF37';
            // Convert hex to rgb for opacity
            // Simple hex parser
            let r = 0, g = 0, b = 0;
            if (hexColor.length === 4) {
                r = parseInt("0x" + hexColor[1] + hexColor[1]);
                g = parseInt("0x" + hexColor[2] + hexColor[2]);
                b = parseInt("0x" + hexColor[3] + hexColor[3]);
            } else if (hexColor.length === 7) {
                r = parseInt("0x" + hexColor[1] + hexColor[2]);
                g = parseInt("0x" + hexColor[3] + hexColor[4]);
                b = parseInt("0x" + hexColor[5] + hexColor[6]);
            }

            return {
                className: "text-xs font-medium text-white rounded-[4px] border-l-2 transition-all shadow-sm overflow-hidden",
                style: {
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
                    borderColor: hexColor, // Strong border color
                    borderLeftWidth: '4px',
                }
            };
        },
        []
    );

    const onEventDrop = useCallback(
        ({ event, start, end, resourceId }: any) => {
            const now = new Date();
            // Allow moving in past for testing, or keep strict? Prompt said nothing. Keeping strict.
            // Actually, prompt said "Blindar a lógica". 

            setConfirmModal({
                isOpen: true,
                event,
                newStart: start,
                newEnd: end,
                resourceId: resourceId || event.resourceId,
            });
        },
        []
    );

    const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
        setCreateModal({ isOpen: true, start });
    }, []);

    const handleConfirmMove = async () => {
        const { event, newStart, newEnd, resourceId } = confirmModal;
        if (!event || !newStart || !newEnd) return;

        const loadingToast = toast.loading("Verificando disponibilidade...");

        try {
            const result = await rescheduleAppointment(
                event.id,
                newStart,
                newEnd,
                resourceId
            );

            if (result.success) {
                setEvents((prev) => {
                    const filtered = prev.filter((e) => e.id !== event.id);
                    return [...filtered, {
                        ...event,
                        start: newStart,
                        end: result.newEnd || newEnd,
                        resourceId: resourceId || event.resourceId
                    }];
                });
                toast.success("Horário atualizado!", { id: loadingToast });
            } else {
                toast.error(result.error || "Falha ao atualizar.", { id: loadingToast });
            }
        } catch (err) {
            toast.error("Erro de conexão.", { id: loadingToast });
        } finally {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
    };

    const components = useMemo(() => ({
        toolbar: CustomToolbar,
        event: CustomEvent, // Add CustomEvent here
    }), []);

    return (
        <div className="h-[85vh] flex flex-col gap-6">
            {/* Page Header integrated for State Access */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-1">
                <div>
                    <h1 className="text-4xl font-serif text-white mb-2">Gestão de Agenda</h1>
                    <p className="text-white/50 text-sm font-light">
                        Visualize e gerencie seus atendimentos com precisão.
                    </p>
                </div>
                <LuxuryButton
                    onClick={() => setCreateModal({ isOpen: true, start: new Date() })}
                    className="bg-[#D4AF37] text-black hover:bg-[#b5952f] border-none shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Agendamento
                </LuxuryButton>
            </div>

            <div className="flex-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden p-6 shadow-2xl relative">
                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <style>{`
                /* Font Overrides */
                .rbc-calendar { font-family: var(--font-sans); color: rgba(255,255,255,0.8); }
                
                /* Header Day Names */
                .rbc-header { 
                    padding: 16px 0; 
                    font-family: var(--font-serif); /* Serif Font */
                    font-size: 0.9rem; 
                    text-transform: uppercase; 
                    letter-spacing: 0.25em; 
                    color: #D4AF37; /* Gold */
                    border-bottom: 1px solid rgba(255,255,255,0.05); 
                    font-weight: 500;
                    text-align: center;
                    border-left: none !important; /* Remove specific side borders */
                }
                .rbc-header + .rbc-header { border-left: none; }

                /* Grid Lines - Almost Invisible */
                .rbc-time-view, .rbc-month-view { border: none; }
                .rbc-day-slot .rbc-time-slot { border-top: 1px solid rgba(255,255,255,0.02); }
                .rbc-timeslot-group { border-bottom: 1px solid rgba(255,255,255,0.02); min-height: 80px; } /* Taller slots */
                .rbc-time-content { border-top: 1px solid rgba(255,255,255,0.05); border-left: none; }
                .rbc-time-gutter .rbc-timeslot-group { 
                    border-bottom: 1px solid rgba(255,255,255,0.02); 
                    color: #71717a; /* text-zinc-500 */
                    font-size: 0.70rem; 
                    display: flex; 
                    align-items: center; 
                    justify-content: right; 
                    padding-right: 12px; 
                }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.02); }

                /* Current Time Indicator - Gold Glow */
                .rbc-current-time-indicator { 
                    background-color: #D4AF37; 
                    height: 2px;
                    box-shadow: 0 0 10px rgba(212,175,55,0.5);
                }
                .rbc-current-time-indicator::before {
                    content: '';
                    position: absolute;
                    left: -4px;
                    top: -3px;
                    width: 8px;
                    height: 8px;
                    background: #D4AF37;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(212,175,55,0.8);
                }

                /* Today Highlight */
                .rbc-today { background-color: rgba(212, 175, 55, 0.015); }
                .rbc-off-range-bg { background-color: transparent; }
                
                /* Hide default toolbar */
                .rbc-toolbar { display: none !important; } 

                /* Scrollbar Styling */
                .rbc-time-content::-webkit-scrollbar { width: 6px; }
                .rbc-time-content::-webkit-scrollbar-track { bg: transparent; }
                .rbc-time-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .rbc-time-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>

                <div className="relative z-10 h-full flex flex-col">
                    <DnDCalendar
                        localizer={localizer}
                        events={events}

                        // CONTROLLED STATE
                        view={view}
                        onView={setView}
                        date={date}
                        onNavigate={setDate}

                        defaultView={Views.WEEK}
                        views={[Views.MONTH, Views.WEEK, Views.DAY]}
                        step={30}
                        timeslots={2}
                        selectable
                        resizable
                        onEventDrop={onEventDrop}
                        onEventResize={onEventDrop}
                        onSelectSlot={handleSelectSlot}
                        eventPropGetter={eventPropGetter}
                        components={components}
                        culture="pt-BR"

                        // Resources
                        resources={resources.length > 0 ? resources : undefined}
                        resourceIdAccessor="id"
                        resourceTitleAccessor="title"

                        className="h-full text-white"
                    />
                </div>

                {/* Confirmation Modal */}
                <Dialog open={confirmModal.isOpen} onOpenChange={(open) => !open && setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
                    <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white sm:max-w-md shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-white tracking-wide">Confirmar Alteração</DialogTitle>
                            <DialogDescription className="text-white/50">
                                Você está movendo um agendamento.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-6">
                            <div className="bg-black/40 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-xl rounded-full -mr-10 -mt-10" />

                                <div className="grid grid-cols-2 gap-8 text-center relative z-10">
                                    <div className="space-y-2">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 block">Antes</span>
                                        <span className="text-red-400/80 text-xl font-light font-sans">{confirmModal.event && format(confirmModal.event.start, "HH:mm")}</span>
                                    </div>
                                    <div className="space-y-2 border-l border-white/5">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 block">Depois</span>
                                        <span className="text-[#D4AF37] text-xl font-medium font-sans filter drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                                            {confirmModal.newStart && format(confirmModal.newStart, "HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <LuxuryButton variant="outline" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="border-white/5 hover:bg-white/5 text-white/60">Cancelar</LuxuryButton>
                            <LuxuryButton onClick={handleConfirmMove} className="bg-[#D4AF37] text-black hover:bg-[#c5a028]">Confirmar</LuxuryButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Create Appointment Modal */}
                <CreateAppointmentModal
                    isOpen={createModal.isOpen}
                    onClose={() => setCreateModal(prev => ({ ...prev, isOpen: false }))}
                    preselectedDate={createModal.start}
                    professionals={resources}
                    clients={clients}
                    services={services}
                    onSuccess={() => {
                        window.location.reload();
                    }}
                />
            </div>
        </div>
    );
}
