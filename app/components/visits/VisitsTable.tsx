import React from 'react';
import { MdDownload } from "react-icons/md";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { VisitPDF } from "./PDF";
import { ApiPatient, PatientVisit } from "@/app/lib/services/patients";

export interface Visit {
    id: string;
    patientName: string;
    doctor: string;
    diagnosis: string;
    date: string;
    status: 'Pendiente' | 'Pago';
    amount: number;
    originalVisit: PatientVisit; // Added to pass to PDF
}

interface VisitsTableProps {
    visits: Visit[];
    patient?: ApiPatient; // Added to pass to PDF
    onDownload: (id: string) => void;
}

export const VisitsTable = ({ visits, patient, onDownload }: VisitsTableProps) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Nombre y Apellido</th>
                        <th className="px-6 py-4">Doctor/a</th>
                        <th className="px-6 py-4">Diagnóstico</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {visits.length > 0 ? (
                        visits.map((visit) => (
                            <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {visit.patientName}
                                </td>
                                <td className="px-6 py-4">{visit.doctor}</td>
                                <td className="px-6 py-4 max-w-xs truncate" title={visit.diagnosis}>
                                    {visit.diagnosis}
                                </td>
                                <td className="px-6 py-4">{visit.date}</td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${visit.status === 'Pago' ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                        <span>${visit.amount}</span>
                                        {visit.status === 'Pago' ? <FaCheckCircle /> : <FaClock />}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">

                                        {patient && (
                                            <PDFDownloadLink
                                                document={<VisitPDF patient={patient} visit={visit.originalVisit} />}
                                                fileName={`informe_${visit.originalVisit.protocol || visit.id}.pdf`}
                                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm flex items-center justify-center"
                                                title="Descargar"
                                            >
                                                {({ loading }) => (
                                                    loading ? '...' : <MdDownload size={18} />
                                                )}
                                            </PDFDownloadLink>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No se encontraron visitas para este paciente.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
