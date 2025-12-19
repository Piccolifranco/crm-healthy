import { api } from "../api";
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";

export interface Appointment {
    _id: string;
    date: string; // YYYY-MM-DD
    hour: string; // HH:mm
    patientId: string;
    patientName: string;
    __v: number;
}

export const useGetAppointments = (month: string) => {
    return useQuery({
        queryKey: ["appointments", month],
        queryFn: () => api.get<Appointment[]>(`/turnos?month=${month}`).then(res => res.data),
        enabled: !!month
    });
};

export interface BookAppointmentPayload {
    date: string;
    hour: string;
    patientId: string;
}

export const useBookAppointment = () => {
    return useMutation({
        mutationFn: (data: BookAppointmentPayload) => api.post<Appointment>("/turnos", data).then(res => res.data)
    });
};

export const useGetAppointmentsInfinite = () => {
    return useInfiniteQuery({
        queryKey: ["appointments", "infinite"],
        queryFn: ({ pageParam }) => api.get<Appointment[]>(`/turnos?month=${pageParam}`).then(res => res.data),
        initialPageParam: new Date().toISOString().slice(0, 7), // YYYY-MM
        getNextPageParam: (lastPage, allPages) => {
            // Calculate next month based on the number of pages loaded
            // This assumes we started from current month and are going forward
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + allPages.length);
            return nextDate.toISOString().slice(0, 7);
        }
    });
};
