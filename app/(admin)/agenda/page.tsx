'use client'

import AgendaList from '@/app/components/agenda/AgendaList'

export default function AgendaPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
                <p className="text-gray-500 mt-2">Próximos turnos programados</p>
            </header>

            <AgendaList />
        </div>
    )
}
