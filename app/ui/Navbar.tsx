import { useState } from "react";
import "./Navbar.css";

export default function Sidebar() {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">CV</div>
        <div className="logo-text">
          <span className="title">Centro de Salud</span>
          <span className="subtitle">Gestión clínica</span>
        </div>
      </div>

      {/* Menú */}
      <nav className="sidebar-menu">
        <a href="/turnos">Turnos</a>
        <a href="/pacientes">Pacientes</a>
        <a href="/historial">Historial clínico</a>
      </nav>

      {/* Perfil */}
      <div className="sidebar-profile">
        <button onClick={() => setOpenProfile(!openProfile)} className="profile-btn">
          <div className="avatar">S</div>
          Mi perfil
        </button>

        {openProfile && (
          <div className="profile-dropdown">
            <a href="/perfil">Ver perfil</a>
            <a href="/configuracion">Configuración</a>
            <button>Cerrar sesión</button>
          </div>
        )}
      </div>
    </aside>
  );
}

