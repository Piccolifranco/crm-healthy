'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NewVisitModal } from '@/app/components/visits/NewVisitModal';
import { VisitsTable, Visit } from '@/app/components/visits/VisitsTable';
import { IoAdd } from "react-icons/io5";
import { toast } from 'react-toastify';
import { usePatientVisits, usePatient } from '@/app/lib/services/patients';
import { useCreateVisit } from '@/app/lib/services/visits';

export default function PatientDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [visits, setVisits] = useState<Visit[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: visitsData, refetch: refetchVisits } = usePatientVisits(id);
    const { data: patientData } = usePatient(id);
    const { mutateAsync: createVisit } = useCreateVisit();

    useEffect(() => {
        if (visitsData && patientData) {
            const mappedVisits: Visit[] = visitsData.map(v => ({
                id: v._id,
                patientName: `${patientData.lastName}, ${patientData.firstName}`,
                doctor: v.doctor,
                diagnosis: v.diagnosis,
                date: new Date(v.date).toLocaleDateString('es-AR'),
                status: v.status as 'Pendiente' | 'Pago',
                amount: v.amount,
                originalVisit: v
            }));
            setVisits(mappedVisits);
        }
    }, [visitsData, patientData]);

    const handleCreateVisit = async (data: any) => {
        try {
            await createVisit({
                date: data.date,
                protocol: data.protocol || '',
                diagnosisType: data.diagnosisType || '',
                diagnosis: data.diagnosis || '',
                description: data.description || '',
                status: data.status,
                amount: Number(data.amount),
                patientId: patientData?._id || '',
            }, {
                onSuccess: () => {
                    refetchVisits();
                }
            });
            toast.success("Visita creada exitosamente");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating visit:", error);
            toast.error("Error al crear la visita");
        }
    };

    const handleDownload = (id: string) => {
        // The download is handled by the PDFDownloadLink in the table

    };

    return (
        <div className="p-8 space-y-6">
            {/* Action Bar */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-sm transition-colors text-lg"
            >
                Nueva Visita
                <IoAdd size={24} />
            </button>

            {/* Table */}
            <VisitsTable
                visits={visits}
                patient={patientData}
                onDownload={handleDownload}
            />

            {/* Modal */}
            <NewVisitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateVisit}
            />
        </div>
    );
}