// @ts-nocheck
"use client";

import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../../styles/calendar.css"; // Luxury Overrides
import { Button } from "../ui/button";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId?: string;
    status?: string;
}

interface Resource {
    id: string;
    title: string;
}

// Mock Data
const MOCK_RESOURCES: Resource[] = [
    { id: "kevelyn", title: "Gabriella Kevelyn" },
    { id: "sarah", title: "Sarah Miller" },
    { id: "julia", title: "Julia Roberts" },
];

const MOCK_EVENTS: Event[] = [
    {
        id: "1",
        title: "Lash Design - Maria",
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(12, 0, 0, 0)),
        resourceId: "kevelyn",
        status: "confirmed"
    },
    {
        id: "2",
        title: "Brows - Ana",
        start: new Date(new Date().setHours(13, 0, 0, 0)),
        end: new Date(new Date().setHours(14, 0, 0, 0)),
        resourceId: "sarah",
        status: "pending"
    }
];

export default function CalendarView() {
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [view, setView] = useState<View>(Views.DAY);
    const [date, setDate] = useState(new Date());

    const onEventResize = useCallback(
        ({ event, start, end }: any) => {
            setEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id);
                const filtered = prev.filter((ev) => ev.id !== event.id);
                return [...filtered, { ...existing!, start, end }];
            });
        },
        [setEvents]
    );

    const onEventDrop = useCallback(
        ({ event, start, end, resourceId }: any) => {
            setEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id);
                const filtered = prev.filter((ev) => ev.id !== event.id);
                return [...filtered, { ...existing!, start, end, resourceId }];
            });
        },
        [setEvents]
    );

    return (
        <div className="h-[800px] bg-background p-6 border border-white/5">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl text-primary font-serif">Studio Schedule</h2>
                    <div className="flex bg-white/5 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView(Views.DAY)}
                            className={view === Views.DAY ? "text-primary bg-white/10" : "text-white/60"}
                        >
                            Day
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView(Views.WEEK)}
                            className={view === Views.WEEK ? "text-primary bg-white/10" : "text-white/60"}
                        >
                            Week
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView(Views.MONTH)}
                            className={view === Views.MONTH ? "text-primary bg-white/10" : "text-white/60"}
                        >
                            Month
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setDate(new Date())}>Today</Button>
                </div>
            </div>

            <DnDCalendar
                defaultView={Views.DAY}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                events={events}
                localizer={localizer}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
                style={{ height: "100%" }}
                resources={MOCK_RESOURCES}
                resourceIdAccessor="id"
                resourceTitleAccessor="title"
                step={15} // 15 min slots
                timeslots={4} // 1 hour = 4 slots
                min={new Date(0, 0, 0, 8, 0, 0)} // Start 8 AM
                max={new Date(0, 0, 0, 20, 0, 0)} // End 8 PM
                dayLayoutAlgorithm="no-overlap"
                components={{
                    event: ({ event }: any) => (
                        <div className={`h-full w-full p-1 text-xs ${event.status === 'confirmed' ? 'bg-primary/20 border-l-2 border-primary' : 'bg-white/10 border-l-2 border-white/30'
                            }`}>
                            <strong>{event.title}</strong>
                        </div>
                    )
                }}
            />
        </div>
    );
}






