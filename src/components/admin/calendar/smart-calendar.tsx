"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths,
    isToday, addWeeks, addDays,
    setHours
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Clock, User, LayoutGrid, Rows3,
    X, CheckCircle2, MessageCircle, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { rescheduleAppointment, updateAppointmentStatus } from "@/actions/calendar-actions";
import { CreateAppointmentModal } from "./create-appointment-modal";
import { toast } from "sonner";

// --- Types ---
export type Appointment = {
    id: string;
    startTime: Date;
    endTime: Date;
    clientName: string;
    clientPhone: string;
    serviceTitle: string;
    professionalName: string;
    professionalId: string;
    status: string;
    color?: string;
};

export type Professional = {
    id: string;
    name: string;
    imageUrl?: string | null;
    role: string;
};

interface SmartCalendarProps {
    appointments: Appointment[];
    professionals: Professional[];
    services: any[];
    clients: any[];
}

type CalendarView = 'month' | 'week' | 'day';

// --- Components Extracted for Performance ---

const MonthGrid = ({
    currentDate,
    appointments,
    onDragStart,
    onDrop,
    onSelectAppointment,
    onClickDay
}: {
    currentDate: Date;
    appointments: Appointment[];
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDrop: (e: React.DragEvent, day: Date, hour: number) => void;
    onSelectAppointment: (appt: Appointment) => void;
    onClickDay: (date: Date) => void;
}) => {
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentDate]);

    const weekDays = ['Don', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Week Header */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
                {weekDays.map(d => (
                    <div key={d} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-white/40">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6">
                {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);
                    const dayApps = appointments.filter(a => isSameDay(new Date(a.startTime), day));

                    return (
                        <div
                            key={day.toISOString()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => onDrop(e, day, 9)} // Default 9am
                            onClick={() => onClickDay(day)}
                            className={cn(
                                "border-r border-b border-white/5 p-2 transition-colors relative group min-h-[100px] cursor-pointer",
                                !isCurrentMonth && "bg-white/[0.01] opacity-40",
                                "hover:bg-white/[0.03]"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-2",
                                isDayToday ? "bg-primary text-black" : "text-white/60"
                            )}>
                                {format(day, 'd')}
                            </span>

                            <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {dayApps.map(appt => (
                                    <div
                                        key={appt.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, appt.id)}
                                        onClick={(e) => { e.stopPropagation(); onSelectAppointment(appt); }}
                                        className={cn(
                                            "text-[10px] px-2 py-1.5 rounded-md border-l-2 cursor-pointer truncate shadow-sm transition-all hover:brightness-125",
                                            appt.status === 'confirmed'
                                                ? "bg-primary/10 border-primary text-primary-foreground"
                                                : "bg-white/10 border-white/30 text-white/80"
                                        )}
                                    >
                                        {format(new Date(appt.startTime), 'HH:mm')} • {appt.clientName.split(' ')[0]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const WeekGrid = ({
    currentDate,
    appointments,
    onDragStart,
    onDrop,
    onSelectAppointment,
    onClickDay,
    zoomLevel
}: {
    currentDate: Date;
    appointments: Appointment[];
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDrop: (e: React.DragEvent, day: Date, hour: number) => void;
    onSelectAppointment: (appt: Appointment) => void;
    onClickDay: (date: Date) => void;
    zoomLevel: number;
}) => {
    const { weekDays, hours } = useMemo(() => {
        const weekStart = startOfWeek(currentDate);
        return {
            weekDays: eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }),
            hours: Array.from({ length: 14 }, (_, i) => i + 7) // 07:00 to 20:00
        };
    }, [currentDate]);

    // Calculate dynamic height based on zoom (1=80px, 2=120px, 3=180px)
    const slotHeight = zoomLevel === 1 ? 80 : zoomLevel === 2 ? 120 : 180;

    return (
        <div className="flex flex-col h-full bg-[#050505] rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex border-b border-white/10 bg-white/[0.02]">
                <div className="w-16 flex-shrink-0 border-r border-white/10" />
                {weekDays.map(day => (
                    <div key={day.toISOString()} className={cn("flex-1 py-4 text-center border-r border-white/10", isToday(day) && "bg-primary/5")}>
                        <div className="text-xs text-white/40 uppercase mb-1">{format(day, 'EEE', { locale: ptBR })}</div>
                        <div className={cn("text-xl font-serif", isToday(day) ? "text-primary" : "text-white")}>{format(day, 'd')}</div>
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {hours.map(hour => (
                    <div key={hour} className="flex border-b border-white/10 relative" style={{ minHeight: slotHeight }}>
                        {/* Time Label */}
                        <div className="w-16 flex-shrink-0 border-r border-white/10 p-2 text-xs text-white/30 font-mono text-right sticky left-0 bg-[#050505] z-10">
                            {hour}:00
                        </div>

                        {/* Columns */}
                        {weekDays.map(day => {
                            const dayApps = appointments.filter(a => {
                                const d = new Date(a.startTime);
                                return isSameDay(d, day) && d.getHours() === hour;
                            });

                            return (
                                <div
                                    key={day.toISOString()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, day, hour)}
                                    // Handle click on empty slot to create
                                    onClick={() => onClickDay(setHours(day, hour))}
                                    className="flex-1 border-r border-white/10 relative hover:bg-white/[0.02] p-1 transition-colors group cursor-pointer"
                                >
                                    {/* Add Button Hint */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-white/20" />
                                    </div>

                                    {dayApps.map(appt => (
                                        <div
                                            key={appt.id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, appt.id)}
                                            onClick={(e) => { e.stopPropagation(); onSelectAppointment(appt); }}
                                            className={cn(
                                                "mb-1 p-2 rounded-md border-l-2 text-xs cursor-pointer shadow-md transition-all hover:scale-[1.02] z-20 relative",
                                                appt.status === 'confirmed' ? "bg-primary/20 border-primary text-white" : "bg-[#1a1a1a] border-white/20 text-white/70"
                                            )}
                                        >
                                            <div className="font-bold flex justify-between items-center">
                                                <span>{format(new Date(appt.startTime), 'HH:mm')}</span>
                                            </div>
                                            <div className="truncate font-medium mt-0.5">{appt.clientName.split(' ')[0]}</div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export function SmartCalendar({ appointments: initialAppointments, professionals, services, clients }: SmartCalendarProps) {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [view, setView] = useState<CalendarView>('month');
    const [zoomLevel, setZoomLevel] = useState(2); // Default medium zoom
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createDate, setCreateDate] = useState<Date | null>(null);

    useEffect(() => {
        setIsMounted(true);
        setCurrentDate(new Date());
    }, []);

    // --- Navigation ---
    const navigate = useCallback((dir: 'prev' | 'next' | 'today') => {
        if (!currentDate) return;
        if (dir === 'today') {
            setCurrentDate(new Date());
            return;
        }
        const amount = dir === 'next' ? 1 : -1;
        setCurrentDate(prev => {
            if (!prev) return new Date();
            if (view === 'month') return addMonths(prev, amount);
            if (view === 'week') return addWeeks(prev, amount);
            if (view === 'day') return addDays(prev, amount);
            return prev;
        });
    }, [view, currentDate]);

    // --- DND Logic ---
    const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('appointmentId', id);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent, targetDate: Date, hour: number) => {
        e.preventDefault();
        const apptId = e.dataTransfer.getData('appointmentId');
        if (!apptId) return;

        const appt = appointments.find(a => a.id === apptId);
        if (!appt) return;

        // Calc new times
        const newStart = new Date(targetDate);
        newStart.setHours(hour, 0, 0, 0); // Reset to top of hour

        const duration = new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime();
        const newEnd = new Date(newStart.getTime() + duration);

        // Optimistic Update
        const updatedList = appointments.map(a =>
            a.id === apptId ? { ...a, startTime: newStart, endTime: newEnd } : a
        );
        setAppointments(updatedList);

        // Server Action
        try {
            const res = await rescheduleAppointment(apptId, newStart, newEnd);
            if (!res.success) {
                throw new Error("Falha ao mover");
            }
        } catch (error) {
            toast.error("Erro ao mover agendamento");
            setAppointments(initialAppointments); // Revert
        }
    }, [appointments, initialAppointments]);

    // --- Action Handlers ---
    const handleStatusUpdate = async (id: string, newStatus: 'confirmed' | 'cancelled' | 'pending') => {
        // Find previous status for reversion
        const previousAppt = appointments.find(a => a.id === id);
        if (!previousAppt) return;

        // Optimistic
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setSelectedAppointment(null);

        try {
            const res = await updateAppointmentStatus(id, newStatus);
            if (!res.success) {
                throw new Error("Falha ao atualizar status");
            }
            toast.success("Status atualizado com sucesso");
        } catch (error) {
            toast.error("Erro ao atualizar status");
            // Revert
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: previousAppt.status } : a));
        }
    };

    const openWhatsApp = (phone: string, name: string) => {
        const clean = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${clean}?text=Olá ${name}, confirmamos seu horário no Kevelyn Studio.`, '_blank');
    };

    const handleDayClick = (date: Date) => {
        setCreateDate(date);
        setIsCreateModalOpen(true);
    };

    if (!isMounted || !currentDate) {
        return (
            <div className="flex flex-col h-[600px] items-center justify-center space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-white/40 text-sm font-medium">Carregando agenda...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <CreateAppointmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                preselectedDate={createDate}
                professionals={professionals}
                services={services}
                clients={clients}
                onSuccess={() => {
                    // Toast handled inside modal
                }}
            />

            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-1">Agenda</h2>
                    <p className="text-white/40 text-sm">Gerencie os horários do estúdio com precisão.</p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => navigate('prev')}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="px-4 min-w-[140px] text-center">
                        <span className="text-white font-medium capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('next')}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <button onClick={() => navigate('today')} className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        HOJE
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom Controls (Only show for week/day views) */}
                    {(view === 'week' || view === 'day') && (
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 mr-2">
                            <button
                                onClick={() => setZoomLevel(z => Math.max(1, z - 1))}
                                className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white transition-colors", zoomLevel === 1 && "opacity-30 cursor-not-allowed")}
                                disabled={zoomLevel === 1}
                            >
                                <span className="text-lg">-</span>
                            </button>
                            <span className="text-xs text-center min-w-[30px] text-white/50">{zoomLevel * 100}%</span>
                            <button
                                onClick={() => setZoomLevel(z => Math.min(3, z + 1))}
                                className={cn("w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white transition-colors", zoomLevel === 3 && "opacity-30 cursor-not-allowed")}
                                disabled={zoomLevel === 3}
                            >
                                <span className="text-lg">+</span>
                            </button>
                        </div>
                    )}

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <ViewBtn active={view === 'month'} onClick={() => setView('month')} icon={<LayoutGrid className="w-4 h-4" />} label="Mês" />
                        <ViewBtn active={view === 'week'} onClick={() => setView('week')} icon={<Rows3 className="w-4 h-4" />} label="Semana" />
                    </div>
                </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 min-h-[600px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${view}-${zoomLevel}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {view === 'month' && (
                            <MonthGrid
                                currentDate={currentDate}
                                appointments={appointments}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onSelectAppointment={setSelectedAppointment}
                                onClickDay={handleDayClick}
                            />
                        )}
                        {view === 'week' && (
                            <WeekGrid
                                currentDate={currentDate}
                                appointments={appointments}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onSelectAppointment={setSelectedAppointment}
                                onClickDay={handleDayClick}
                                zoomLevel={zoomLevel}
                            />
                        )}
                        {view === 'day' && (
                            <WeekGrid
                                currentDate={currentDate}
                                appointments={appointments}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onSelectAppointment={setSelectedAppointment}
                                onClickDay={handleDayClick}
                                zoomLevel={zoomLevel} // Reusing WeekGrid for Day view (same structure in this component)
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedAppointment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAppointment(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Header Image/Gradient */}
                            <div className="h-32 bg-gradient-to-br from-primary/20 via-black to-black relative">
                                <button onClick={() => setSelectedAppointment(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="absolute -bottom-8 left-8 flex items-end">
                                    <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-4 border-[#121212] flex items-center justify-center">
                                        <span className="text-3xl font-serif text-white">{selectedAppointment.clientName.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 pb-8 px-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-serif text-white">{selectedAppointment.clientName}</h3>
                                    <p className="text-white/40">{selectedAppointment.serviceTitle}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InfoCard icon={<Clock />} label="Horário" value={`${format(new Date(selectedAppointment.startTime), 'HH:mm')} - ${format(new Date(selectedAppointment.endTime), 'HH:mm')}`} />
                                    <InfoCard icon={<User />} label="Profissional" value={selectedAppointment.professionalName} />
                                    <InfoCard icon={<CalendarIcon />} label="Data" value={format(new Date(selectedAppointment.startTime), "dd 'de' MMMM", { locale: ptBR })} />
                                    <div className={cn("p-4 rounded-xl border flex flex-col justify-center",
                                        selectedAppointment.status === 'confirmed' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-white/60"
                                    )}>
                                        <span className="text-xs uppercase tracking-wider opacity-70">Status</span>
                                        <span className="font-medium capitalize">{selectedAppointment.status === 'pending' ? 'Pendente' : selectedAppointment.status}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        onClick={() => openWhatsApp(selectedAppointment.clientPhone, selectedAppointment.clientName)}
                                        className="w-full py-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5" /> Confirmar no WhatsApp
                                    </button>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
                                            className="py-3 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary text-white border border-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Confirmar
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                                            className="py-3 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white border border-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Helpers ---

const ViewBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            active ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-white/50 hover:text-white"
        )}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
        <div className="text-primary/60 w-5 h-5">{icon}</div>
        <div>
            <span className="text-xs uppercase tracking-wider text-white/30 block">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    </div>
);
