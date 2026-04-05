// InscriptionForm.jsx

import { useState, useEffect } from "react";
import { DEPARTAMENTOS } from "../data/departamentos";
import analytics from "../scripts/analytics";

export default function InscriptionForm({ onSuccess }) {
    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        telefono: "",
        departamento: DEPARTAMENTOS[0].name,
        email: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false); // ← Estado interno

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "telefono") {
            newValue = value.replace(/\D/g, "");
        }
        if (name === "nombres" || name === "apellidos") {
            newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
        }

        setForm((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await analytics.trackFormSubmit('inscription_form', {
                first_name: form.nombres,
                last_name: form.apellidos,
                email: form.email,
                phone: form.telefono,
                departamento: form.departamento,
                country: 'Bolivia'
            });

            // ← Si hay callback, llamarlo
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess();
            } else {
                // ← Si no hay callback, mostrar mensaje de éxito interno
                setSubmitSuccess(true);
            }

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert('Hubo un error al enviar tus datos. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ← Mostrar mensaje de éxito si no hay callback externo
    if (submitSuccess) {
        return (
            <div className="flex flex-col justify-center items-center w-[95%] sm:w-[95%] md:w-[70%] lg:w-[35%] m-5 bg-green-50 p-10 shadow-lg rounded-2xl border-2 border-green-500">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-green-700 mb-2">
                        ¡Datos Guardados Exitosamente!
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Gracias {form.nombres} por completar tus datos.
                    </p>
                    <p className="text-sm text-gray-500">
                        Pronto nos pondremos en contacto contigo.
                    </p>
                    
                    {/* Botón opcional para continuar */}
                    <button
                        onClick={() => window.location.href = '/material'}
                        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        Continuar al Material
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center w-[95%] sm:w-[95%] md:w-[70%] lg:w-[35%] sm:h-[50%] m-5 bg-white p-7 sm:py-10 sm:px-15 shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Completa tus Datos
            </h2>
            
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="flex gap-2 sm:flex-row flex-col">
                    <label className="w-full">
                        <span className="text-sm font-medium text-gray-700">Nombres *</span>
                        <input
                            type="text"
                            required
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            inputMode="text"
                            placeholder="Juan"
                            className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full mb-4 text-base sm:text-5xl lg:text-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </label>
                    <label className="w-full">
                        <span className="text-sm font-medium text-gray-700">Apellidos *</span>
                        <input
                            type="text"
                            required
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            inputMode="text"
                            placeholder="Pérez"
                            className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full mb-4 text-base sm:text-5xl lg:text-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </label>
                </div>

                <label className="w-full">
                    <span className="text-sm font-medium text-gray-700">Email *</span>
                    <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="juan@example.com"
                        className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full mb-4 text-base sm:text-5xl lg:text-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />
                </label>

                <div className="flex gap-2 sm:flex-row flex-col">
                    <label className="w-full">
                        <span className="text-sm font-medium text-gray-700">Departamento *</span>
                        <select 
                            name="departamento" 
                            required
                            value={form.departamento}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full mb-4 text-base sm:text-5xl lg:text-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                        >
                            {DEPARTAMENTOS.map((departamento) => (
                                <option key={departamento.id} value={departamento.name}>
                                    {departamento.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    
                    <label className="w-full">
                        <span className="text-sm font-medium text-gray-700">Teléfono *</span>
                        <input
                            type="tel"
                            name="telefono"
                            required
                            value={form.telefono}
                            onChange={handleChange}
                            pattern="\d{8,}"
                            inputMode="numeric"
                            placeholder="70123456"
                            className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full mb-4 text-base sm:text-5xl lg:text-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-white lg:text-lg sm:text-5xl sm:my-6 font-medium w-full lg:py-3 sm:py-12 lg:rounded-xl sm:rounded-2xl rounded-xl h-12 transition ${
                        isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Datos'}
                </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
                * Campos obligatorios
            </p>
        </div>
    );
}