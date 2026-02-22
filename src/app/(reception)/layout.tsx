export default function ReceptionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            {/* We purposely omit the NavBar and Footer here for a Kiosk-like experience */}
            <main className="relative min-h-screen">
                {children}
            </main>
        </div>
    );
}





