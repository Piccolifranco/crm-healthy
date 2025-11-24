'use client';
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

export interface LoginResponse {
  code: number;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginErrorResponse {
  code: number;
  msg: string;
  data: null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data;
};

export const useLogin = () =>
  useMutation<LoginResponse, LoginErrorResponse, LoginPayload>({
    mutationKey: ["login"],
    mutationFn: login,
  });

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  lastname: string;
}

export interface RegisterResponse {
  code: number;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterErrorResponse {
  code: number;
  msg: string;
  data: null;
}

const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", payload);
    console.log("Register response:", res);
    return res.data;
  } catch (error) {
    console.error("Register api error:", error);
    throw error;
  }
};

export const useRegister = () =>
  useMutation<RegisterResponse, RegisterErrorResponse, RegisterPayload>({
    mutationKey: ["register"],
    mutationFn: register,
  });