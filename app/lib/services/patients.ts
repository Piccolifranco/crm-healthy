import { api } from "../api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Patient } from "@/app/components/patients/PatientsTable"

// Define the raw API response shape based on user input
export interface ApiPatient {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    dni: string;
    doctor: string;
    insurance: string;
    lastVisit: string;
    email?: string;
    __v?: number;
}

interface PatientsResponse {
    data: ApiPatient[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export const usePatients = () => {
    return useQuery({
        queryKey: ["patients"],
        queryFn: () => api.get<PatientsResponse>("/pacientes?search=").then(res => {
            const responseData = res.data;

            const transformedPatients = responseData.data.map(p => ({
                id: p._id, // Map _id to id for frontend
                fullName: `${p.lastName}, ${p.firstName}`,
                age: p.age,
                dni: p.dni,
                doctor: p.doctor,
                insurance: p.insurance,
                lastVisit: p.lastVisit,
                email: p.email
            })) as Patient[];

            return {
                ...responseData,
                data: transformedPatients
            };
        })
    })
}


export interface PatientVisit {
    _id: string;
    patientId: string;
    date: string;
    protocol: string;
    diagnosisType: string;
    diagnosis: string;
    description: string;
    status: string;
    amount: number;
    doctor: string;
    __v: number;
}

export const usePatientVisits = (id: string) => {
    return useQuery({
        queryKey: ["patientVisits", id],
        queryFn: () => api.get<PatientVisit[]>(`/pacientes/${id}/visitas`).then(res => {
            return res.data;
        })
    })
}

export const usePatient = (id: string) => {
    return useQuery({
        queryKey: ["patient", id],
        queryFn: () => api.get<ApiPatient>(`/pacientes/${id}`).then(res => res.data)
    })
}

export interface CreatePatientData {
    firstName: string;
    lastName: string;
    age: number;
    dni: string;
    insurance: string;
    email: string;
    __v?: number;
}

export interface NewPatientResponse {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    dni: string;
    doctor: string;
    insurance: string;
    _id: string;
    __v: number;
}

export const useNewPatient = () => {
    return useMutation({
        mutationFn: (data: CreatePatientData) => api.post<NewPatientResponse>("/pacientes", data).then(res => res.data)
    })
}

export interface PatientWithVisits extends ApiPatient {
    visits: PatientVisit[];
}

export const usePatientByEmail = (email: string) => {
    return useQuery({
        queryKey: ["patientByEmail", email],
        queryFn: () => api.get<PatientWithVisits>(`/pacientes/email/${email}`).then(res => res.data),
        enabled: !!email
    })
}

export const useDeletePatient = () => {
    return useMutation({
        mutationFn: (id: string) => api.delete(`/pacientes/${id}`).then(res => res.data)
    })
}