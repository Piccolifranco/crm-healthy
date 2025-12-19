'use client'
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeCookie } from "../lib/cookies";
import { FaHeart, FaMicroscope } from "react-icons/fa";

type SidebarProps = {
  elements: Array<{
    href: string;
    label: string;
  }>
}

export default function Sidebar({ elements }: SidebarProps) {
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <aside className="sticky top-0 shrink-0 flex flex-col gap-9 w-[260px] h-screen p-6 bg-white border-r border-gray-200 shadow-sm font-sans z-40">
      {/* Logo */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-xl shadow-md">
          <FaHeart />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-xl text-gray-900">HolaDoc</span>
          <span className="text-[13px] text-gray-500">Gestión clínica</span>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex flex-col gap-3">
        {elements.map((element) => (
          <Link
            key={element.href}
            href={element.href}
            className="px-4 py-2.5 text-[15px] font-medium text-gray-800 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-amber-600 hover:translate-x-1"
          >
            {element.label}
          </Link>
        ))}
      </nav>

      {/* Perfil */}
      <div className="relative mt-auto">
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-3 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] cursor-pointer transition-all duration-200 hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-11 h-11 bg-amber-500 text-white font-bold text-base rounded-full shadow-md">
            <FaMicroscope />
          </div>
          Mi perfil
        </button>

        {openProfile && (
          <div className="absolute bottom-[60px] left-0 flex flex-col w-full py-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-[fadeIn_0.2s_ease_forwards]">

            <button
              onClick={() => {
                removeCookie("accessToken");
                router.push("/");
              }}
              className="px-4 py-2.5 text-left text-sm font-medium text-gray-800 bg-transparent border-none cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-amber-600"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

