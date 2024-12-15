
const QuestionMessage = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
        <p className="text-gray-800">{message}</p>
        <div className="mt-4 flex justify-center gap-10">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionMessage;
