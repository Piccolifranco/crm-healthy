import Navbar from "../ui/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col md:flex-row">
            <Navbar elements={[
                { href: "/agenda", label: "Agenda" },
                { href: "/pacientes", label: "Pacientes" },
            ]} />
            <div className="flex-1 min-h-screen bg-gray-50 pt-16 md:pt-0">
                {children}
            </div>
        </div>
    );
}