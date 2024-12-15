import { FaSpinner } from 'react-icons/fa';

const LoadingMessage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <FaSpinner className="w-10 h-10 text-blue-500 animate-spin mb-4 mx-auto" />
        <p className="text-lg font-semibold text-blue-700">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingMessage;
