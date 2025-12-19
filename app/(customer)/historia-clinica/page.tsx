"use client";
import React from "react";
import { useAuthStore } from "@/app/lib/store/authStore";
import { usePatientByEmail } from "@/app/lib/services/patients";
import MyAppointments from "@/app/components/appointments/MyAppointments";
import { PatientInfoCard } from "@/app/components/patients/PatientInfoCard";
import { PatientVisitsTable } from "@/app/components/patients/PatientVisitsTable";

export default function ClinicalHistoryPage() {
    const { user } = useAuthStore();
    const { data: patient, isLoading, error } = usePatientByEmail(user?.email || "");

    if (isLoading || !patient) {
        return <div className="p-8 text-center">Cargando historia clínica...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error al cargar la historia clínica o paciente no encontrado.</div>;
    }

    return (
        <div className="min-h-[calc(100vh-88px)] bg-gray-50 flex justify-center px-4 py-8">
            <div className="w-full max-w-5xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Historia Clínica
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Información general del paciente y registro de consultas.
                        </p>

                    </div>
                </div>

                {/* Card de datos del paciente */}
                <PatientInfoCard patient={patient} />

                {/* Tabla de visitas */}
                <PatientVisitsTable patient={patient} />

                {/* Mis Turnos */}
                <MyAppointments patientId={patient._id} />
            </div>
        </div>
    );
}
