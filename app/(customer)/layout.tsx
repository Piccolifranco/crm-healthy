import Navbar from "../ui/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <Navbar elements={[
                { href: "/turnos", label: "Turnos" },
                { href: "/historia-clinica", label: "Historia clínica" },
            ]} />
            <div className="flex-1 min-h-screen bg-gray-50">
                {children}
            </div>
        </div>
    );
}