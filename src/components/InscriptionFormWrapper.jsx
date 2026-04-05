import { useState, useEffect } from "react";
import InscriptionForm from "./InscriptionForm";
import analytics from "../scripts/analytics";

export default function InscriptionFormWrapper() {
    const [loading, setLoading] = useState(true);
    const [hasCompleteData, setHasCompleteData] = useState(false);
    const [prospectData, setProspectData] = useState(null);

    useEffect(() => {
        checkProspect();
    }, []);

    const checkProspect = async () => {
        setLoading(true);
        try {
            const data = await analytics.checkProspectData();
            console.log('🔍 Prospect check result:', data);
            setHasCompleteData(data.has_complete_data);
            setProspectData(data.prospect);
        } catch (error) {
            console.error('❌ Error checking prospect:', error);
            setHasCompleteData(false);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSuccess = async () => {
        console.log('✅ Form submitted successfully, rechecking...');
        // Esperar un poco para que el backend procese
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkProspect();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
                <span className="ml-4 text-gray-600">Verificando datos...</span>
            </div>
        );
    }

    // Si ya tiene datos completos
    if (hasCompleteData) {
        return (
            <div className="flex flex-col justify-center items-center w-[95%] sm:w-[95%] md:w-[70%] lg:w-[35%] m-5 bg-green-50 p-10 shadow-lg rounded-2xl border-2 border-green-500">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-green-700 mb-2">
                        ¡Hola de nuevo, {prospectData?.first_name || 'amigo'}!
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Tus datos ya están registrados en nuestro sistema.
                    </p>
                    <div className="bg-white p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">
                            <strong>Email:</strong> {prospectData?.email || 'N/A'}<br />
                            <strong>Departamento:</strong> {prospectData?.departamento || 'N/A'}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                        Pronto nos pondremos en contacto contigo.
                    </p>
                    
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                        Ver Material Completo
                    </button>
                </div>
            </div>
        );
    }

    // Si NO tiene datos completos, mostrar formulario
    return <InscriptionForm onSuccess={handleFormSuccess} />;
}