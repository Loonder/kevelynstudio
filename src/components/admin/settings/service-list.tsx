"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { ServiceRow } from "./service-row";
import { reorderServices, toggleFeatured } from "@/actions/settings-actions";
import { toast } from "sonner"; // Assuming sonner is installed, if not will replace with basic alert or install

interface ServiceListProps {
    initialServices: any[];
    onEdit: (service: any) => void;
}

export function ServiceList({ initialServices, onEdit }: ServiceListProps) {
    const [services, setServices] = useState(initialServices);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setServices((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Optimistic UI established. Now sync with server.
                // Prepare minimal payload
                const orderPayload = newOrder.map((item, index) => ({
                    id: item.id,
                    order: index
                }));

                reorderServices(orderPayload).then(res => {
                    if (!res.success) toast.error("Erro ao salvar ordem");
                    else toast.success("Ordem atualizada!");
                });

                return newOrder;
            });
        }
    }

    async function handleToggleFeatured(id: string, current: boolean) {
        // Optimistic Update
        setServices(prev => prev.map(s => s.id === id ? { ...s, isFeatured: !current } : s));

        const res = await toggleFeatured(id, current);
        if (!res.success) {
            toast.error("Erro ao destacar");
            // Revert
            setServices(prev => prev.map(s => s.id === id ? { ...s, isFeatured: current } : s));
        } else {
            toast.success(current ? "Removido dos destaques" : "Adicionado aos destaques");
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={services}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {services.map((service) => (
                        <ServiceRow
                            key={service.id}
                            service={service}
                            onEdit={onEdit}
                            onToggleFeatured={handleToggleFeatured}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}





