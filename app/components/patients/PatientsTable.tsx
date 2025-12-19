import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { MdDelete } from "react-icons/md";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";

// Interface matches the columns requested
export interface Patient {
    id: string;
    fullName: string; // Combined Name and Surname for display or raw
    age: number | string;
    dni: string;
    doctor: string;
    insurance: string;
    lastVisit: string;
    email?: string;
}

interface PatientsTableProps {
    data: Patient[];
    onDelete: (id: string) => void;
    onRowClick: (id: string) => void;
}

type SortKey = keyof Patient;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const PatientsTable = ({ data, onDelete, onRowClick }: PatientsTableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'lastVisit', direction: 'desc' });

    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedData = useMemo(() => {
        if (!data) return [];

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle null/undefined values
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Special handling for dates
            if (sortConfig.key === 'lastVisit') {
                const dateA = new Date(aValue as string).getTime();
                const dateB = new Date(bValue as string).getTime();

                // Check for invalid dates (epoch 0 or NaN)
                const isValidA = !isNaN(dateA) && new Date(aValue as string).getFullYear() > 1970;
                const isValidB = !isNaN(dateB) && new Date(bValue as string).getFullYear() > 1970;

                if (!isValidA && !isValidB) return 0;
                if (!isValidA) return 1; // Invalid dates go to bottom
                if (!isValidB) return -1;

                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const renderSortIcon = (columnKey: SortKey) => {
        if (sortConfig.key !== columnKey) return <div className="w-4" />; // Placeholder to keep alignment
        return sortConfig.direction === 'asc' ? <IoArrowUp size={14} /> : <IoArrowDown size={14} />;
    };

    const SortableHeader = ({ label, columnKey }: { label: string, columnKey: SortKey }) => (
        <th
            className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none group"
            onClick={() => handleSort(columnKey)}
        >
            <div className="flex items-center gap-1">
                {label}
                <span className="text-gray-400 group-hover:text-gray-600">
                    {renderSortIcon(columnKey)}
                </span>
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <SortableHeader label="Nombre y Apellido" columnKey="fullName" />
                        <th className="hidden md:table-cell px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none group" onClick={() => handleSort('age')}>
                            <div className="flex items-center gap-1">
                                Edad
                                <span className="text-gray-400 group-hover:text-gray-600">{renderSortIcon('age')}</span>
                            </div>
                        </th>
                        <th className="hidden md:table-cell px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none group" onClick={() => handleSort('dni')}>
                            <div className="flex items-center gap-1">
                                DNI
                                <span className="text-gray-400 group-hover:text-gray-600">{renderSortIcon('dni')}</span>
                            </div>
                        </th>
                        <SortableHeader label="Doctor/a" columnKey="doctor" />
                        <th className="hidden md:table-cell px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none group" onClick={() => handleSort('insurance')}>
                            <div className="flex items-center gap-1">
                                Obra Social
                                <span className="text-gray-400 group-hover:text-gray-600">{renderSortIcon('insurance')}</span>
                            </div>
                        </th>
                        <th className="hidden md:table-cell px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none group" onClick={() => handleSort('lastVisit')}>
                            <div className="flex items-center gap-1">
                                Última Visita
                                <span className="text-gray-400 group-hover:text-gray-600">{renderSortIcon('lastVisit')}</span>
                            </div>
                        </th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sortedData.length > 0 ? (
                        sortedData.map((patient) => (
                            <tr
                                key={patient.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onRowClick(patient.id)}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {patient.fullName}
                                </td>
                                <td className="hidden md:table-cell px-6 py-4">{patient.age}</td>
                                <td className="hidden md:table-cell px-6 py-4">{patient.dni}</td>
                                <td className="px-6 py-4">{patient.doctor}</td>
                                <td className="hidden md:table-cell px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {patient.insurance}
                                    </span>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4">
                                    {patient.lastVisit && new Date(patient.lastVisit).getFullYear() > 1970
                                        ? format(new Date(patient.lastVisit), "dd/MM/yyyy")
                                        : "-"}
                                </td>
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(patient.id);
                                            }}
                                            className="p-1.5 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                                            title="Eliminar"
                                        >
                                            <MdDelete size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                No se encontraron pacientes.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
