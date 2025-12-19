# HolaDoc 🏥

**HolaDoc** es una aplicación web integral diseñada para la gestión eficiente de pacientes y turnos médicos. Desarrollada con tecnologías modernas, ofrece una experiencia fluida tanto para administradores (profesionales de la salud) como para pacientes.

## 🚀 Características Principales

### Para Administradores (Profesionales)
- **Gestión de Pacientes**: Alta, baja y modificación de pacientes con información detallada.
- **Agenda Médica**: Visualización clara de turnos y disponibilidad.
- **Historia Clínica**: Acceso rápido al historial de visitas de cada paciente.
- **Búsqueda y Filtrado**: Herramientas potentes para encontrar pacientes por nombre, DNI, obra social, etc.
- **Generación de Reportes**: Descarga de historias clínicas y visitas en formato PDF.

### Para Pacientes (Clientes)
- **Portal de Autogestión**: Acceso seguro a su información personal.
- **Reserva de Turnos**: Interfaz intuitiva (calendario) para visualizar disponibilidad y reservar citas.
- **Historial de Visitas**: Visualización y descarga de sus propias historias clínicas.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido sobre un stack tecnológico robusto y moderno:

- **Frontend Core**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para un código tipado y seguro.
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) para un diseño responsivo y moderno.
- **Estado Global**: [Zustand](https://zustand-demo.pmnd.rs/) para la gestión de estado ligero y eficiente.
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) para el manejo de estado asíncrono y caché.
- **Calendario**: `react-big-calendar` para la gestión visual de turnos.
- **Notificaciones**: `react-toastify` para feedback al usuario.
- **PDFs**: `@react-pdf/renderer` para la generación de documentos dinámicos.
- **Cliente HTTP**: `axios` con interceptores para manejo de autenticación.

## 📂 Estructura del Proyecto

El proyecto sigue la arquitectura de **Next.js App Router**:

```
crm-healthy/
├── app/
│   ├── (admin)/          # Rutas protegidas para administradores (Agenda, Pacientes)
│   ├── (customer)/       # Rutas para pacientes (Turnos, Historia Clínica)
│   ├── components/       # Componentes reutilizables de UI
│   ├── lib/              # Lógica de negocio, servicios API y stores
│   ├── layout.tsx        # Layout principal de la aplicación
│   └── page.tsx          # Página de inicio / Login
├── public/               # Archivos estáticos
└── package.json          # Dependencias y scripts
```

## ⚡ Instalación y Ejecución

Sigue estos pasos para correr el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone <https://github.com/Piccolifranco/crm-healthy.git>
    cd crm-healthy
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**
    Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🔒 Autenticación y Seguridad

- **Manejo de Sesiones**: Tokens JWT almacenados en cookies seguras.
- **Protección de Rutas**: Middleware y lógica de cliente para restringir acceso según roles.
- **Auto-Logout**: Cierre de sesión automático ante errores de autenticación (401) para proteger la cuenta.

---

Desarrollado con ❤️ para mejorar la gestión de la salud.
