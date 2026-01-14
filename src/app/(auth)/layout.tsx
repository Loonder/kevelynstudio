export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#050505] relative overflow-hidden selection:bg-primary/30 selection:text-white">
            {/* Ambient Background - Shared with Admin but focused for center content */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full opacity-40 animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full opacity-30 animate-pulse" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            <main className="relative z-10 w-full max-w-md p-4 animate-in fade-in zoom-in-95 duration-700">
                {children}
            </main>
        </div>
    );
}
