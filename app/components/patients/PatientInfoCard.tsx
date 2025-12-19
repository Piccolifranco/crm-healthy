import React from "react";
import { format } from "date-fns";
import { ApiPatient } from "@/app/lib/services/patients";

interface PatientInfoCardProps {
    patient: ApiPatient;
}

export const PatientInfoCard = ({ patient }: PatientInfoCardProps) => {
    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {patient.lastName}, {patient.firstName}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Edad:{" "}
                        <span className="font-medium text-gray-700">
                            {patient.age} años
                        </span>
                    </p>
                </div>

                <div className="flex flex-col sm:items-end text-sm">
                    <span className="text-gray-500">Última visita</span>
                    <span className="font-medium text-gray-800">
                        {patient.lastVisit ? format(patient.lastVisit, "dd/MM/yyyy") : "Sin visitas"}
                    </span>
                </div>
            </div>
        </section>
    );
};
