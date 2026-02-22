
"use client";

import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";

// Mock Profile Data
const MOCK_PROFILE = {
    id: "1",
    fullName: "Ana Silva",
    email: "ana@example.com",
    phone: "+55 11 99999-9999",
    totalVisits: 12,
    role: "VIP",
    sensory: {
        favoriteMusic: "Jazz & Soul",
        drinkPreference: "Champagne",
        temperature: "Warm",
        musicVolume: "Soft"
    },
    history: [
        { date: "2026-01-15", service: "Lash Design - Volume", notes: "Used C-curl, 10-12mm mapping. Client requested extra fullness." },
        { date: "2025-12-20", service: "Brow Lamination", notes: "Standard protocol. Very happy with results." }
    ]
};

// Next.js 15: params is a Promise
export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // In a real app, use(params) or await params in async component.
    // For client component, we unwrap or use hook if needed. 
    // But easier to make this an async server component? 
    // Let's stick to client for interactive editing for now, ignore params specific unwrapping strictly for this mock.

    const client = MOCK_PROFILE;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="h-20 border-b border-white/10 flex items-center px-6 justify-between bg-surface">
                <div className="flex items-center gap-4">
                    <Link href="/admin/clients" className="text-white/50 hover:text-white transition-colors">← Back</Link>
                    <div className="h-8 w-px bg-white/10" />
                    <h1 className="font-serif text-2xl text-white">{client.fullName}</h1>
                    <span className="px-2 py-0.5 border border-primary text-primary text-[10px] uppercase tracking-widest">{client.role}</span>
                </div>
                <Button variant="ghost" className="text-primary hover:text-white">Edit Profile</Button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Sensory & Bio */}
                <div className="space-y-8">
                    {/* Sensory Card */}
                    <div className="bg-gradient-to-br from-white/5 to-black border border-primary/20 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-50 transition-opacity">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                        <h2 className="text-primary font-serif text-xl mb-6">Sensory Profile</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Drink Preference</span>
                                <span className="text-white font-medium">{client.sensory.drinkPreference}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Temperature</span>
                                <span className="text-white font-medium">{client.sensory.temperature}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Music Vibe</span>
                                <span className="text-white font-medium">{client.sensory.favoriteMusic}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-white/50 text-sm">Volume</span>
                                <span className="text-white font-medium">{client.sensory.musicVolume}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/5 border border-white/10 p-6">
                        <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">Engagement</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-3xl text-white font-serif">{client.totalVisits}</div>
                                <div className="text-[10px] text-white/40 uppercase">Total Visits</div>
                            </div>
                            <div>
                                <div className="text-3xl text-white font-serif">$1.2k</div>
                                <div className="text-[10px] text-white/40 uppercase">Lifetime Value</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Technical History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-serif text-xl text-white">Technical History</h2>
                        <Button variant="outline" size="sm" className="border-white/10 text-white/60">+ Add Note</Button>
                    </div>

                    <div className="space-y-4">
                        {client.history.map((record, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-white font-medium">{record.service}</h4>
                                    <span className="text-white/40 text-sm">{new Date(record.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">{record.notes}</p>

                                {/* Photo Strip Placeholder */}
                                <div className="mt-4 flex gap-2">
                                    <div className="w-16 h-16 bg-black/50 border border-white/5 flex items-center justify-center text-white/20 text-xs">Photo</div>
                                    <div className="w-16 h-16 bg-black/50 border border-white/5 flex items-center justify-center text-white/20 text-xs">Photo</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
