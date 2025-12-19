import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export interface CreateVisitData {
    date: string;
    protocol: string;
    diagnosisType: string;
    diagnosis: string;
    description: string;
    status: string;
    amount: number;
    doctor?: string;
    patientId: string;
}
export const useCreateVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVisitData) => api.post(`/visitas`, data),
    })
}