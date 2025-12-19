"use client";
import React from "react";
import { useAuthStore } from "@/app/lib/store/authStore";
import { usePatientByEmail } from "@/app/lib/services/patients";
import { format } from "date-fns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { VisitPDF } from "@/app/components/visits/PDF";
import { MdDownload } from "react-icons/md";

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
                                {format(patient.lastVisit, "dd/MM/yyyy") || "Sin visitas"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Tabla de visitas */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Consultas y diagnósticos
                        </h3>
                    </div>

                    {(!patient.visits || patient.visits.length === 0) ? (
                        <p className="text-sm text-gray-500">
                            No hay registros de consultas para este paciente.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 font-medium text-gray-600">
                                            Fecha
                                        </th>
                                        <th className="hidden md:table-cell px-4 py-3 font-medium text-gray-600">
                                            Diagnóstico
                                        </th>
                                        <th className="hidden md:table-cell px-4 py-3 font-medium text-gray-600">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 font-medium text-gray-600 text-center">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {patient.visits.map((visit) => (
                                        <tr key={visit._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 align-top text-gray-800 whitespace-nowrap">
                                                {new Date(visit.date).toLocaleDateString()}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-3 align-top text-gray-900 font-medium">
                                                {visit.diagnosis}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-3 align-top text-gray-700">
                                                {visit.description}
                                            </td>
                                            <td className="px-4 py-3 align-top text-center">
                                                <PDFDownloadLink
                                                    document={<VisitPDF patient={patient} visit={visit} />}
                                                    fileName={`informe_${visit.protocol || visit._id}.pdf`}
                                                    className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm"
                                                    title="Descargar PDF"
                                                >
                                                    {({ loading }) => (
                                                        loading ? '...' : <MdDownload size={18} />
                                                    )}
                                                </PDFDownloadLink>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
