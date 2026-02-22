
"use client";

import { Button } from "../../../../../components/ui/button";
import Link from "next/link";

const MOCK_STUDENTS = [
    { id: "s1", name: "Maria Santos", email: "maria@example.com", progress: 100, enrolledAt: "2025-11-01" },
    { id: "s2", name: "Ana Costa", email: "ana@example.com", progress: 75, enrolledAt: "2025-12-15" },
    { id: "s3", name: "Beatriz Silva", email: "bia@example.com", progress: 40, enrolledAt: "2026-01-10" },
    { id: "s4", name: "Julia Lima", email: "julia@example.com", progress: 20, enrolledAt: "2026-01-22" },
];

export default function CourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/academy" className="text-white/50 hover:text-white">← Courses</Link>
                    <h1 className="text-2xl font-serif text-white">Student Progress</h1>
                </div>
                <Button variant="outline" className="border-primary/20 text-primary">Export CSV</Button>
            </div>

            <div className="border border-white/10 bg-white/5">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider text-xs">
                            <th className="p-4 font-normal">Student</th>
                            <th className="p-4 font-normal">Progress</th>
                            <th className="p-4 font-normal">Enrolled</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_STUDENTS.map(student => (
                            <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="text-white">{student.name}</div>
                                    <div className="text-xs text-white/40">{student.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{ width: `${student.progress}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm ${student.progress === 100 ? 'text-green-400' : 'text-white/60'}`}>
                                            {student.progress}%
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-white/60">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="sm" className="text-white/40">Message</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
