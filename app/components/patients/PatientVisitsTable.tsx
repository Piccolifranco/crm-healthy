import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { VisitPDF } from "@/app/components/visits/PDF";
import { MdDownload } from "react-icons/md";
import { ApiPatient, PatientWithVisits } from "@/app/lib/services/patients";

interface PatientVisitsTableProps {
    patient: PatientWithVisits;
}

export const PatientVisitsTable = ({ patient }: PatientVisitsTableProps) => {
    return (
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
    );
};
