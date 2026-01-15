"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer, Views, View, Navigate } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { rescheduleAppointment } from "@/actions/calendar-actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter, Users } from "lucide-react";
import { CreateAppointmentModal } from "./create-appointment-modal";
import { AppointmentDetailModal } from "./appointment-detail-modal";
import { EditAppointmentModal } from "./edit-appointment-modal";
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
    defaultDate?: Date;
}

// Custom Toolbar Component
const CustomToolbar = ({
    onNavigate,
    onView,
    view,
    date,
    label,
    // Custom Props passed via components prop context or parent
    resources,
    selectedProfessionalId,
    setSelectedProfessionalId,
    onDateChange
}: any) => {
    return (
        <div className="flex flex-col gap-3 mb-2 md:mb-6 border-b border-white/5 pb-4 md:pb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">

                {/* Navigation & Date */}
                <div className="flex flex-row items-center justify-between w-full lg:w-auto gap-2 md:gap-4">
                    <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/5 shadow-inner scale-90 md:scale-100 origin-left">
                        <button
                            onClick={() => onNavigate(Navigate.PREVIOUS)}
                            className="p-1.5 md:p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-[#D4AF37] transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => onNavigate(Navigate.TODAY)}
                            className="px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all border-x border-white/5 mx-1"
                        >
                            Hoje
                        </button>
                        <button
                            onClick={() => onNavigate(Navigate.NEXT)}
                            className="p-1.5 md:p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-[#D4AF37] transition-all"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>

                    {/* Date Picker Integration */}
                    <div className="relative group flex-1 md:flex-none flex justify-end md:justify-start">
                        <div className="absolute inset-y-0 right-0 md:left-0 pr-3 md:pl-3 md:pr-0 flex items-center pointer-events-none md:justify-start justify-end sticky-date-icon">
                            <CalendarIcon className="h-4 w-4 text-[#D4AF37]" />
                        </div>
                        {/* Mobile: Date aligned right, Desktop: Date aligned left */}
                        <input
                            type="date"
                            className="bg-black/40 text-white/90 text-xs md:text-sm font-medium rounded-full border border-white/10 pl-4 pr-10 md:pl-10 md:pr-4 py-1.5 md:py-2 focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer hover:bg-white/5 transition-all text-right md:text-left w-full md:w-auto"
                            value={format(date, 'yyyy-MM-dd')}
                            onChange={(e) => {
                                if (e.target.valueAsDate) {
                                    onDateChange(e.target.valueAsDate);
                                }
                            }}
                        />
                        <h2 className="text-xl md:text-2xl font-serif text-white ml-4 capitalize tracking-wide hidden lg:inline-block">
                            {format(date, "MMMM yyyy", { locale: ptBR })}
                        </h2>
                    </div>
                </div>

                {/* Filters & View Switcher */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full lg:w-auto">

                    {/* Professional Filter */}
                    <div className="relative w-full sm:w-[200px]">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-white/30" />
                        <select
                            value={selectedProfessionalId}
                            onChange={(e) => setSelectedProfessionalId(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-full py-1.5 md:py-2 pl-9 pr-8 text-xs md:text-sm text-white/80 focus:outline-none focus:border-[#D4AF37] appearance-none"
                        >
                            <option value="all">Todos os Profissionais</option>
                            {resources.map((res: any) => (
                                <option key={res.id} value={res.id}>{res.title}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-black/40 rounded-full p-1 border border-white/5 w-full sm:w-auto justify-center">
                        {['month', 'week', 'day'].map((v) => (
                            <button
                                key={v}
                                onClick={() => onView(v.toUpperCase())}
                                className={`px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex-1 sm:flex-none
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
        <div className="flex flex-col h-full justify-center px-0.5 md:px-1">
            <div className="text-[8px] md:text-[10px] font-bold opacity-80 uppercase tracking-wider truncate flex items-center gap-0.5 md:gap-1">
                <span className="text-[10px] md:text-xs">{getIcon(event.category)}</span>
                <span className="truncate">{event.serviceTitle}</span>
            </div>
            <div className="text-[10px] md:text-xs font-medium truncate">
                {event.clientName}
            </div>
        </div>
    );
};

export function AdminCalendar({ initialEvents, resources, clients, services, defaultDate = new Date() }: AdminCalendarProps) {
    const calendarRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState(initialEvents);

    // Detectar view inicial baseado no tamanho da tela
    const getInitialView = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768 ? Views.DAY : Views.WEEK;
        }
        return Views.WEEK;
    };

    const [view, setView] = useState<View>(getInitialView);
    const [date, setDate] = useState(defaultDate);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('all');
    const router = useRouter(); // M6: For soft refresh instead of reload

    // Enable mouse wheel scroll on calendar time content
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            const timeContent = calendarRef.current?.querySelector('.rbc-time-content') as HTMLElement;
            if (timeContent && calendarRef.current?.contains(e.target as Node)) {
                e.preventDefault();
                timeContent.scrollTop += e.deltaY;
            }
        };

        const calendarElement = calendarRef.current;
        if (calendarElement) {
            calendarElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (calendarElement) {
                calendarElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    // Create Modal State
    const [createModal, setCreateModal] = useState<{
        isOpen: boolean;
        start: Date | null;
        end: Date | null;
    }>({
        isOpen: false,
        start: null,
        end: null
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

    // Detail Modal State
    const [detailModal, setDetailModal] = useState<{
        isOpen: boolean;
        appointment: any | null;
    }>({
        isOpen: false,
        appointment: null,
    });

    // Edit Modal State
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        appointment: any | null;
    }>({
        isOpen: false,
        appointment: null,
    });

    // Handle clicking on an event to view details
    const handleSelectEvent = useCallback((event: any) => {
        setDetailModal({
            isOpen: true,
            appointment: event,
        });
    }, []);

    // Handle opening edit modal from detail modal (M5: delay to prevent flicker)
    const handleOpenEditModal = useCallback((appointment: any) => {
        setDetailModal({ isOpen: false, appointment: null });
        setTimeout(() => {
            setEditModal({ isOpen: true, appointment });
        }, 150);
    }, []);

    // Filtered Events Logic
    const filteredEvents = useMemo(() => {
        if (selectedProfessionalId === 'all') return events;
        return events.filter((evt: any) => evt.resourceId === selectedProfessionalId);
    }, [events, selectedProfessionalId]);

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
                    borderColor: hexColor,
                    borderLeftWidth: '4px',
                }
            };
        },
        []
    );

    const onEventDrop = useCallback(
        ({ event, start, end, resourceId }: any) => {
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

    const handleSelectSlot = useCallback(({ start, end, action }: { start: Date, end: Date, action: string }) => {
        // Pre-fill modal with start time
        setCreateModal({ isOpen: true, start, end });
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
        toolbar: (props: any) => (
            <CustomToolbar
                {...props}
                resources={resources}
                selectedProfessionalId={selectedProfessionalId}
                setSelectedProfessionalId={setSelectedProfessionalId}
                onDateChange={setDate}
            />
        ),
        event: CustomEvent,
    }), [resources, selectedProfessionalId]);

    // Calendar Hours Constraints
    const minTime = useMemo(() => new Date(0, 0, 0, 8, 0, 0), []); // 08:00
    const maxTime = useMemo(() => new Date(0, 0, 0, 21, 0, 0), []); // 21:00

    // ... (resto do código anterior permanece igual)

    return (
        <div className="h-[calc(100vh-60px)] md:h-[calc(100vh-40px)] flex flex-col gap-2 md:gap-6">
            {/* Header section optimized for mobile */}
            <div className="flex flex-row justify-between items-center md:items-end gap-2 px-1">
                <div>
                    <h1 className="text-2xl md:text-4xl font-serif text-white md:mb-2">Agenda</h1>
                    <p className="hidden md:block text-white/50 text-sm font-light">
                        Visualize e gerencie seus atendimentos com precisão.
                    </p>
                </div>
                <LuxuryButton
                    onClick={() => setCreateModal({ isOpen: true, start: new Date(), end: null })}
                    className="bg-[#D4AF37] text-black hover:bg-[#b5952f] border-none shadow-[0_0_20px_rgba(212,175,55,0.3)] px-3 py-2 h-auto text-xs md:text-sm md:px-4 md:py-2"
                >
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Novo Agendamento</span>
                    <span className="md:hidden">Novo</span>
                </LuxuryButton>
            </div>

            {/* MAIN CALENDAR CONTAINER - CORREÇÃO AQUI */}
            <div className="flex-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-xl p-2 md:p-6 shadow-2xl relative flex flex-col min-h-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <style>{`
  /* --- 1. FONTES E CORES GERAIS --- */
  .rbc-calendar { font-family: var(--font-sans); color: rgba(255,255,255,0.8); }

  /* --- 2. CABEÇALHO (DIAS DA SEMANA) --- */
  .rbc-header { 
    padding: 12px 4px; 
    font-family: var(--font-serif); 
    font-size: 0.65rem; 
    text-transform: uppercase; 
    letter-spacing: 0.15em; 
    color: #D4AF37; 
    border-bottom: 1px solid rgba(255,255,255,0.05); 
    font-weight: 500;
    text-align: center;
    border-left: none !important;
    background: transparent !important;
    flex: 1 1 0px !important;
  }
  
  /* Desktop - headers maiores */
  @media (min-width: 768px) {
    .rbc-header {
      padding: 16px 0;
      font-size: 0.9rem;
      letter-spacing: 0.25em;
    }
  }
  
  .rbc-header + .rbc-header { border-left: none; }

  /* Remover fundo das colunas de horário à esquerda */
  .rbc-time-gutter, .rbc-time-header-gutter {
    background-color: transparent !important;
    border-right: 1px solid rgba(255,255,255,0.05) !important;
  }

  /* --- 3. LINHAS E GRADES (GRID) --- */
  .rbc-time-view, .rbc-month-view { border: none; }
  .rbc-day-slot { background: transparent !important; }
  .rbc-day-slot .rbc-time-slot { border-top: 1px solid rgba(255,255,255,0.02); }
  
  .rbc-timeslot-group { 
    border-bottom: 1px solid rgba(255,255,255,0.02); 
    min-height: 60px; /* Altura de cada hora - menor no mobile */
    background: transparent !important; 
  }
  
  /* Desktop - timeslots maiores */
  @media (min-width: 768px) {
    .rbc-timeslot-group {
      min-height: 80px;
    }
  }
  
  .rbc-time-content { border-top: 1px solid rgba(255,255,255,0.05); border-left: none; }

  /* Estilo da coluna de horas (08:00, 09:00...) */
  .rbc-time-gutter .rbc-timeslot-group { 
    border-bottom: 1px solid rgba(255,255,255,0.02); 
    color: #71717a; 
    font-size: 0.60rem; 
    display: flex; 
    align-items: center; 
    justify-content: right; 
    padding-right: 8px;
    background: transparent !important;
  }
  
  @media (min-width: 768px) {
    .rbc-time-gutter .rbc-timeslot-group {
      font-size: 0.70rem;
      padding-right: 12px;
    }
  }
  
  .rbc-day-bg + .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.02); }

  /* Fundos transparentes */
  .rbc-day-bg, .rbc-month-row, .rbc-month-view, .rbc-off-range-bg { 
    background-color: transparent !important; 
  }

  /* Destaque do Dia Atual */
  .rbc-today { background-color: rgba(212, 175, 55, 0.015) !important; }

  /* Esconder Toolbar padrão (pois criamos a nossa) */
  .rbc-toolbar { display: none !important; } 

  /* --- 4. CORREÇÃO CRÍTICA DO SCROLL & RESPONSIVIDADE --- */

  /* O container raiz do calendário deve ocupar 100% da altura do pai flexivel */
  .rbc-calendar { 
    height: 100% !important; 
    width: 100%;
    display: flex; 
    flex-direction: column; 
  }

  /* A "Visão de Tempo" (Time View) deve ser um flex container vertical */
  .rbc-time-view { 
    flex: 1; 
    display: flex !important; 
    flex-direction: column; 
    height: 100% !important; 
    min-height: 0; 
    width: 100%;
    overflow-x: auto; /* Permitir scroll horizontal se necessário no mobile */
  }

  /* O Cabeçalho (Time Header) - responsivo */
  .rbc-time-header { 
    flex: 0 0 auto; 
    min-width: 100%; /* Mobile: 100% */
  }
  
  @media (min-width: 768px) {
    .rbc-time-header {
      min-width: 600px; /* Desktop: largura mínima maior */
    }
  }

  /* O Conteúdo (Time Content) é O ÚNICO que deve ter scroll */
  .rbc-time-content { 
    flex: 1 1 0% !important; 
    overflow-y: auto !important; 
    overflow-x: auto; /* Scroll horizontal sincronizado */
    border-top: 1px solid rgba(255,255,255,0.05); 
    width: 100%;
    min-width: 100%; /* Mobile: 100% */
  }
  
  @media (min-width: 768px) {
    .rbc-time-content {
      min-width: 600px; /* Desktop: largura mínima maior */
    }
  }

  /* Customização da Barra de Rolagem (Scrollbar) */
  .rbc-time-content::-webkit-scrollbar { width: 6px; height: 6px; }
  .rbc-time-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
  .rbc-time-content::-webkit-scrollbar-thumb { 
    background: rgba(255,255,255,0.15); 
    border-radius: 10px; 
  }
  .rbc-time-content::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.6); }
  
  /* --- 5. EVENTOS - Melhor exibição no mobile --- */
  .rbc-event {
    padding: 2px 4px !important;
  }
  
  @media (min-width: 768px) {
    .rbc-event {
      padding: 4px 8px !important;
    }
  }
  
  .rbc-event-label {
    font-size: 0.65rem !important;
  }
  
  @media (min-width: 768px) {
    .rbc-event-label {
      font-size: 0.75rem !important;
    }
  }
  
  .rbc-event-content {
    font-size: 0.70rem !important;
  }
  
  @media (min-width: 768px) {
    .rbc-event-content {
      font-size: 0.875rem !important;
    }
  }
`}</style>

                <div ref={calendarRef} className="relative z-10 h-full flex flex-col min-h-0">
                    <DnDCalendar
                        localizer={localizer}
                        events={filteredEvents}
                        // ... props restantes iguais ...
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
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                        components={components}
                        culture="pt-BR"
                        min={minTime}
                        max={maxTime}
                        className="h-full text-white"
                    />
                </div>

                {/* Modals permanecem iguais... */}
                {/* ... */}
            </div>

            {/* Confirmation Modal and Create Modal here... */}
            <Dialog open={confirmModal.isOpen} onOpenChange={(open) => !open && setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
                {/* ... conteúdo do modal de confirmação ... */}
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

            <CreateAppointmentModal
                isOpen={createModal.isOpen}
                onClose={() => setCreateModal(prev => ({ ...prev, isOpen: false }))}
                preselectedDate={createModal.start}
                preselectedEndDate={createModal.end}
                professionals={resources}
                clients={clients}
                services={services}
                onSuccess={() => {
                    router.refresh(); // M6: Better UX than window.location.reload
                }}
            />

            {/* Appointment Detail Modal */}
            <AppointmentDetailModal
                appointment={detailModal.appointment}
                open={detailModal.isOpen}
                onOpenChange={(open) => setDetailModal(prev => ({ ...prev, isOpen: open }))}
                onEdit={handleOpenEditModal}
            />

            {/* Appointment Edit Modal */}
            <EditAppointmentModal
                appointment={editModal.appointment}
                open={editModal.isOpen}
                onOpenChange={(open) => setEditModal(prev => ({ ...prev, isOpen: open }))}
                onSuccess={() => {
                    router.refresh(); // M6: Better UX than window.location.reload
                }}
            />
        </div>
    )
};
