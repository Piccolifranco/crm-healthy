import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRegister } from "../../lib/services/auth";

interface RegisterProps {
    onLoginClick: () => void;
}

export default function Register({ onLoginClick }: RegisterProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const { mutateAsync: register } = useRegister();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await register({ email, password, name, lastname }, {
                onSuccess: () => {
                    toast.success("Registro exitoso. Por favor inicie sesión.");
                    onLoginClick();
                },
                onError: (error) => {
                    console.error("Register mutation error:", error);
                    toast.error("Error al registrarse. Por favor intente nuevamente.");
                }
            })
        } catch (error) {
            console.error("Register catch error:", error);
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Nombre
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder="Nombre"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700"
                >
                    Apellido
                </label>
                <input
                    type="text"
                    id="lastname"
                    placeholder="Apellido"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Correo Electrónico"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-6">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="Contraseña"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="text-sm mb-4">
                <button
                    type="button"
                    onClick={onLoginClick}
                    className="font-medium text-gray-900 hover:text-gray-800"
                >
                    ¿Ya tienes una cuenta? <span className="cursor-pointer text-blue-600">Inicia Sesión</span>
                </button>
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Registrarse
            </button>
        </form>
    );
}
