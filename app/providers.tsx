"use client";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create only once per session

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer position="bottom-right" autoClose={3000} className="z-99999!" />
    </QueryClientProvider>
  );
}