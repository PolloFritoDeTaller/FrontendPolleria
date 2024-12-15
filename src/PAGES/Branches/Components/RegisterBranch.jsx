import { useState } from 'react';
import axios from "axios";
import { API } from "../../../api/conf/routeApi";
import AcceptMessage from '../../../GENERALCOMPONENTS/AcceptMessage';
import QuestionMessage from '../../../GENERALCOMPONENTS/QuestionMessage';

const RegisterBranch = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nameBranch: '',
    address: '',
    phone: '',
  });

  const [message, setMessage] = useState("");  // Mensaje para notificaciones
  const [showQuestionMessage, setShowQuestionMessage] = useState(false);  // Para confirmar la acción
  const [showAcceptMessage, setShowAcceptMessage] = useState(false);  // Para mostrar la respuesta de éxito
  const [acceptMessageText, setAcceptMessageText] = useState("");  // Texto del mensaje de aceptación

  // Función para manejar el registro
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API}/branches`, formData);
      setAcceptMessageText(`Sucursal "${formData.nameBranch}" creada exitosamente`);
      setShowAcceptMessage(true);
      
      // Limpiamos los campos después de la creación
      setFormData({ nameBranch: '', address: '', phone: '' });
    } catch (error) {
      console.log(error);
      setAcceptMessageText(error.response?.data?.message || "Error al registrar la sucursal");
      setShowAcceptMessage(true);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowQuestionMessage(true);
  };

  // Actualiza el estado del formulario en función de los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registrar Nueva Sucursal
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre de la Sucursal</label>
          <input
            type="text"
            name="nameBranch"
            value={formData.nameBranch}
            onChange={handleInputChange}
            maxLength={25}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            maxLength={30}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Teléfono</label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition-all"
        >
          Crear Sucursal
        </button>
      </form>

      {/* Mensaje de confirmación de la acción */}
      {message && (
        <p className="mt-4 text-center font-medium text-green-600">{message}</p>
      )}

      {/* QuestionMessage para confirmar la creación de la sucursal */}
      {showQuestionMessage && (
        <QuestionMessage
          message={`¿Estás seguro que deseas crear esta sucursal?`}
          onConfirm={() => {
            setShowQuestionMessage(false);
            handleRegister();
          }}
          onCancel={() => setShowQuestionMessage(false)}
        />
      )}

      {/* AcceptMessage para mostrar el resultado de la creación */}
      {showAcceptMessage && (
        <AcceptMessage
          message={acceptMessageText}
          onAccept={() => {
            setShowAcceptMessage(false);
            window.location.reload(); // Recargar la página después de hacer click en "Aceptar"
          }}
        />
      )}
    </div>
  );
};

export default RegisterBranch;
