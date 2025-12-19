'use client'
import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import ShiftModal from '@/app/components/ShiftModal'
import { useGetAppointments } from '@/app/lib/services/appointments'

const locales = {
    'es': es,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const ALL_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

const MyCalendar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

    const { data: appointments } = useGetAppointments(currentMonth);

    const handleSelectSlot = ({ start }: { start: Date }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return;
        }

        const dateStr = format(start, 'yyyy-MM-dd');

        // Filter out taken slots
        const takenSlots = appointments
            ?.filter(app => app.date === dateStr)
            .map(app => app.hour) || [];

        const available = ALL_SLOTS.filter(slot => !takenSlots.includes(slot));

        setSelectedDate(start);
        setAvailableHours(available);
        setIsModalOpen(true);
    };

    // Función para colorear las celdas
    const dayPropGetter = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            return {
                className: '!bg-gray-100 !text-gray-400 !cursor-not-allowed',
                style: { pointerEvents: 'none' as const }
            };
        }

        const dateStr = format(date, 'yyyy-MM-dd');

        const takenSlots = appointments
            ?.filter(app => app.date === dateStr)
            .map(app => app.hour) || [];

        const isFull = ALL_SLOTS.every(slot => takenSlots.includes(slot));

        if (isFull) {
            return {
                className: '!bg-red-200/50 hover:!bg-red-300/50 cursor-pointer transition-colors',
            };
        } else {
            return {
                className: '!bg-green-200/50 hover:!bg-green-300/50 cursor-pointer transition-colors',
            };
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[calc(100vh-8rem)]">
                <style jsx global>{`
                    .rbc-calendar {
                        font-family: inherit;
                    }
                    .rbc-header {
                        padding: 12px 0;
                        font-weight: 600;
                        color: #374151;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .rbc-month-view {
                        border: 1px solid #e5e7eb;
                        border-radius: 0.75rem;
                        overflow: hidden;
                    }
                    .rbc-day-bg {
                        transition: background-color 0.2s;
                    }
                    .rbc-day-bg + .rbc-day-bg {
                        border-left: 1px solid #e5e7eb;
                    }
                    .rbc-month-row + .rbc-month-row {
                        border-top: 1px solid #e5e7eb;
                    }
                    .rbc-off-range-bg {
                        background-color: #f9fafb !important;
                    }
                    .rbc-today {
                        background-color: #eff6ff; /* blue-50 */
                    }
                    /* Event styling */
                    .rbc-event {
                        background-color: #0ea5e9;
                        border: none;
                        border-radius: 4px;
                        padding: 2px 6px;
                    }
                    
                    /* Toolbar styling */
                    .rbc-toolbar {
                        margin-bottom: 20px;
                        flex-direction: column;
                        gap: 10px;
                    }
                    @media (min-width: 640px) {
                        .rbc-toolbar {
                            flex-direction: row;
                        }
                    }
                    .rbc-toolbar button {
                        border: 1px solid #e5e7eb;
                        color: #374151;
                        font-weight: 500;
                        padding: 0.375rem 0.75rem;
                    }
                    .rbc-toolbar button:hover {
                        background-color: #D97706;
                    }
                    .rbc-toolbar button.rbc-active {
                        background-color: #F59E0B;
                        color: white;
                    }
                    .rbc-toolbar button.rbc-active:hover {
                        background-color: #D97706;
                    }
                `}</style>
                <Calendar
                    localizer={localizer}
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    culture='es'
                    selectable
                    longPressThreshold={10}
                    onSelectSlot={handleSelectSlot}
                    dayPropGetter={dayPropGetter}
                    date={selectedDate || new Date()}
                    onNavigate={(newDate) => {
                        setSelectedDate(newDate);
                        setCurrentMonth(format(newDate, 'yyyy-MM'));
                    }}
                    views={['month']}
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "No hay eventos en este rango",
                    }}
                />
            </div>

            <ShiftModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDate}
                availableHours={availableHours}
            />
        </div>
    )
}

export default MyCalendar