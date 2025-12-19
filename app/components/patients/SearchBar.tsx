import React from 'react';
import { IoSearchOutline } from "react-icons/io5";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative w-full max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <IoSearchOutline size={20} />
            </div>
            <input
                type="text"
                className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-amber-500 outline-none transition-shadow"
                placeholder="Buscar pacientes..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
