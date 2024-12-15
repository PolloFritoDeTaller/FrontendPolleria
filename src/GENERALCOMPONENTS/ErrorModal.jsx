import { useEffect, useState } from "react";

const ErrorModal = ({ error, setError }) => {

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error) {
      // Obtiene el mensaje de error desde el objeto error
      const message = error?.response?.data?.message || "Ha ocurrido un error inesperado";
      setErrorMessage(message);
    }
  }, [error]);

  const handleAcceptClick = async () => {
    // Verifica si el error tiene un token
    if (error?.response?.data?.token) {
      try {
        setError(null);
      } catch (error) {
        setError(null);
      }
    } else {
      setError(null);
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
