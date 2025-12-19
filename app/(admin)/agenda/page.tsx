'use client'

import { useEffect } from 'react'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useGetAppointmentsInfinite } from '@/app/lib/services/appointments'
import { useInView } from 'react-intersection-observer'

export default function AgendaPage() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useGetAppointmentsInfinite();

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    // Flatten appointments from all pages
    const appointments = data?.pages.flat() || [];

    // Group appointments by date
    const groupedAppointments = appointments.reduce((acc, appointment) => {
        if (!acc[appointment.date]) {
            acc[appointment.date] = [];
        }
        acc[appointment.date].push(appointment);
        return acc;
    }, {} as Record<string, typeof appointments>);

    // Sort dates
    const sortedDates = Object.keys(groupedAppointments).sort();

    const getDayLabel = (dateStr: string) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'Hoy';
        if (isTomorrow(date)) return 'Mañana';
        return format(date, "EEEE d 'de' MMMM", { locale: es });
    };

    if (status === 'pending') {
        return <div className="p-6 text-center">Cargando agenda...</div>;
    }

    if (status === 'error') {
        return <div className="p-6 text-center text-red-500">Error al cargar la agenda.</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
                <p className="text-gray-500 mt-2">Próximos turnos programados</p>
            </header>

            <div className="space-y-8">
                {sortedDates.map((date) => (
                    <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 capitalize flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            {getDayLabel(date)}
                        </h2>

                        <div className="grid gap-4">
                            {groupedAppointments[date]
                                .sort((a, b) => a.hour.localeCompare(b.hour))
                                .map((appointment) => (
                                    <div
                                        key={appointment._id}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-50 text-blue-600 font-bold p-3 rounded-lg min-w-[80px] text-center">
                                                {appointment.hour}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">{appointment.patientName}</h3>

                                            </div>
                                        </div>


                                    </div>
                                ))}
                        </div>
                    </div>
                ))}

                {sortedDates.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No hay turnos programados próximamente.</p>
                    </div>
                )}

                <div ref={ref} className="py-4 text-center text-gray-500">
                    {isFetchingNextPage ? 'Cargando más turnos...' : hasNextPage ? 'Desplázate para ver más' : 'No hay más turnos'}
                </div>
            </div>
        </div>
    )
}
