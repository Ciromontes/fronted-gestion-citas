import BuscadorHistorias from './BuscadorHistorias';

/**
 * Página dedicada para buscar y consultar historias clínicas de mascotas
 */
const HistoriasPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Historias Clínicas</h2>
                    <p className="text-gray-600 mb-6">Busca y consulta el historial médico completo de las mascotas.</p>
                    <BuscadorHistorias />
                </div>
            </div>
        </div>
    );
};

export default HistoriasPage;
