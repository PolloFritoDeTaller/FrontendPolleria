// src/GENERALCOMPONENTS/ErrorModal.jsx
import { useEffect, useState } from "react";

const ErrorModal = ({ error, setError, refreshComponent }) => {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error) {
      // Obtiene el mensaje de error desde el objeto error
      const message = error?.response?.data?.message || "Ha ocurrido un error inesperado";
      setErrorMessage(message);
    }
  }, [error]);

  const handleAcceptClick = async () => {
    // Verifica si setError es una función antes de llamarla
    if (setError && typeof setError === "function") {
      setError(null);
    }

    // Llamar a la función para "refrescar" el componente
    if (refreshComponent && typeof refreshComponent === "function") {
      refreshComponent();
    }
  };

  if (!error) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="mb-4 text-lg font-semibold text-red-700">
          {errorMessage}
        </p>
        <button
          onClick={handleAcceptClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
