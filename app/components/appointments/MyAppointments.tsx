'use client'

import { useEffect } from 'react'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useGetAppointmentsInfinite } from '@/app/lib/services/appointments'
import { useInView } from 'react-intersection-observer'

interface MyAppointmentsProps {
    patientId: string;
}

export default function MyAppointments({ patientId }: MyAppointmentsProps) {
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

    // Filter appointments for this patient and future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const myAppointments = appointments.filter(app => {
        const appDate = parseISO(app.date);
        return app.patientId === patientId && appDate >= today;
    });

    // Group appointments by date
    const groupedAppointments = myAppointments.reduce((acc, appointment) => {
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
        return <div className="p-6 text-center">Cargando turnos...</div>;
    }

    if (status === 'error') {
        return <div className="p-6 text-center text-red-500">Error al cargar los turnos.</div>;
    }

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Mis Turnos
                </h3>
            </div>

            <div className="space-y-8">
                {sortedDates.map((date) => (
                    <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3 capitalize flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            {getDayLabel(date)}
                        </h2>

                        <div className="grid gap-3">
                            {groupedAppointments[date]
                                .sort((a, b) => a.hour.localeCompare(b.hour))
                                .map((appointment) => (
                                    <div
                                        key={appointment._id}
                                        className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white text-amber-600 font-bold px-3 py-1.5 rounded-md border border-gray-200 text-sm">
                                                {appointment.hour}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Consulta General</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}

                {sortedDates.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">No tienes turnos programados próximamente.</p>
                    </div>
                )}

                <div ref={ref} className="py-2 text-center text-xs text-gray-400">
                    {isFetchingNextPage ? 'Cargando más...' : ''}
                </div>
            </div>
        </section>
    )
}
