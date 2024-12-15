import React from 'react';

const AcceptMessage = ({ message, onAccept }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
        <p className="text-gray-800">{message}</p>
        <div className="mt-4">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptMessage;
