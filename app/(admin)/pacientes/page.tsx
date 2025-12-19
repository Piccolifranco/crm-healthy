'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/app/components/patients/SearchBar';
import { PatientsTable, Patient } from '@/app/components/patients/PatientsTable';
import { NewPatientModal } from '@/app/components/patients/NewPatientModal';
import { DeleteConfirmationModal } from '@/app/components/DeleteConfirmationModal';
import { IoAdd } from "react-icons/io5";
import { toast } from 'react-toastify';
import { usePatients, useNewPatient, useDeletePatient, CreatePatientData } from '@/app/lib/services/patients';


export default function PatientsPage() {
    const router = useRouter();
    const { data: paginatedPatients, refetch } = usePatients();
    const { mutateAsync: createPatient } = useNewPatient();
    const { mutateAsync: deletePatient } = useDeletePatient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [patientToDeleteId, setPatientToDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (paginatedPatients?.data) {
            setPatients(paginatedPatients.data);
        }
    }, [paginatedPatients]);

    // Filter logic
    const filteredPatients = patients?.filter(patient =>
        (patient.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (patient.doctor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (patient.insurance?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleCreatePatient = async (data: CreatePatientData) => {
        try {
            await createPatient(data);
            toast.success("Paciente creado exitosamente");
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            console.error("Error creating patient:", error);
            toast.error("Error al crear el paciente");
        }
    };

    const handleDeleteClick = (id: string) => {
        setPatientToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!patientToDeleteId) return;

        try {
            await deletePatient(patientToDeleteId);
            toast.success("Paciente eliminado");
            refetch();
            setIsDeleteModalOpen(false);
            setPatientToDeleteId(null);
        } catch (error) {
            console.error("Error deleting patient:", error);
            toast.error("Error al eliminar el paciente");
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="w-full sm:w-auto flex-1">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                    Nuevo paciente
                    <IoAdd size={20} />
                </button>
            </div>

            {/* Table */}
            <PatientsTable
                data={filteredPatients}
                onDelete={handleDeleteClick}
                onRowClick={(id) => router.push(`/pacientes/${id}`)}
            />

            {/* Create Modal */}
            <NewPatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePatient}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Paciente"
                message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer."
            />
        </div>
    );
}