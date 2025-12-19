import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useBookAppointment } from '@/app/lib/services/appointments';
import { useAuthStore } from '@/app/lib/store/authStore';
import { usePatientByEmail } from '@/app/lib/services/patients';
import { useQueryClient } from '@tanstack/react-query';

interface ShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
    availableHours: string[];
}

export default function ShiftModal({ isOpen, onClose, date, availableHours }: ShiftModalProps) {
    const { user } = useAuthStore();
    const { data: patient } = usePatientByEmail(user?.email || "");
    const { mutateAsync: bookAppointment } = useBookAppointment();
    const queryClient = useQueryClient();

    if (!isOpen || !date) return null;

    const handleSelectSlot = async (hour: string) => {
        if (!patient) {
            toast.error("No se pudo identificar al paciente. Por favor, inicie sesión nuevamente.");
            return;
        }

        try {
            await bookAppointment({
                date: format(date, 'yyyy-MM-dd'),
                hour,
                patientId: patient._id
            });
            toast.success(`Turno reservado con éxito el ${format(date, 'dd/MM/yyyy')} para las ${hour} hs`, {
                position: "top-center"
            });
            // Invalidate queries to refresh the calendar
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            onClose();
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Error al reservar el turno");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Turnos Disponibles
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                            {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {availableHours.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {availableHours.map((hour) => (
                                <button
                                    key={hour}
                                    className="py-2 px-3 text-sm font-medium cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                    onClick={() => handleSelectSlot(hour)}
                                >
                                    {hour}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No hay turnos disponibles para esta fecha.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
