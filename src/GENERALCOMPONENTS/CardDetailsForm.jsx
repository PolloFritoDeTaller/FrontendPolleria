import React from "react";

const CardDetailsPage = () => {
    const handleCloseWindow = () => {
        window.close(); // Cierra la ventana actual
    };
    return (
        <div className="container mx-auto px-4 py-6">
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información de la Tarjeta
            </h3>
            <form className="flex flex-col space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Número de Tarjeta
                </label>
                <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full border rounded-md p-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Fecha de Vencimiento
                </label>
                <input
                type="text"
                placeholder="MM/AA"
                className="mt-1 block w-full border rounded-md p-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                CVV
                </label>
                <input
                type="password"
                placeholder="123"
                className="mt-1 block w-full border rounded-md p-2"
                />
            </div>
            <button
                type="button"
                onClick={handleCloseWindow}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
                Confirmar
            </button>
            </form>
        </div>
        </div>
    );
};

export default CardDetailsPage;
