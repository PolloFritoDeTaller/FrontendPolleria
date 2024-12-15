import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBranchDetailsRequest } from "../../api/branch";
import { FaTrashAlt } from "react-icons/fa";
import { deleteBranchText, deleteBranchImage } from '../../api/branch.js';
import QuestionMessage from "../../GENERALCOMPONENTS/QuestionMessage"; // Componente de confirmación
import AcceptMessage from "../../GENERALCOMPONENTS/AcceptMessage"; // Componente de éxito/error
import { API } from "../../api/conf/routeApi.js";

const ViewBranchPage = () => {
  const { id } = useParams(); 
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // El item que se va a eliminar
  const [deletionError, setDeletionError] = useState(false); // Flag para manejar el error
  const [deletionSuccess, setDeletionSuccess] = useState(false); // Flag para manejar éxito
  const navigate = useNavigate();

  // Obtener los detalles de la sucursal
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await getBranchDetailsRequest(id); // Solo una solicitud
        setBranch(response.data.branch);
      } catch (error) {
        console.error("Error al obtener los detalles de la sucursal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [id]);

  // Función para manejar la eliminación de una imagen
  const handleDeleteImage = (imageId) => {
    setItemToDelete({ type: 'image', id: imageId });
    setShowDeleteConfirmation(true);
  };

  // Función para manejar la eliminación de un mensaje
  const handleDeleteText = (textId) => {
    setItemToDelete({ type: 'text', id: textId });
    setShowDeleteConfirmation(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      if (itemToDelete.type === 'image') {
        // Llamamos a la API para eliminar la imagen
        await deleteBranchImage(id, itemToDelete.id);
        setBranch({
          ...branch,
          images: branch.images.filter((image) => image._id !== itemToDelete.id), // Eliminar la imagen del estado
        });
      } else if (itemToDelete.type === 'text') {
        // Llamamos a la API para eliminar el texto
        await deleteBranchText(id, itemToDelete.id);
        setBranch({
          ...branch,
          texts: branch.texts.filter((text) => text._id !== itemToDelete.id), // Eliminar el texto del estado
        });
      }
      setShowDeleteConfirmation(false); // Cerramos la confirmación
      setDeletionSuccess(true); // Establecer éxito
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      setDeletionError(true); // Mostrar error
      setShowDeleteConfirmation(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleErrorAccept = () => {
    setDeletionError(false);
  };

  const handleSuccessAccept = () => {
    setDeletionSuccess(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Aquí va el contenido de la sucursal */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">{branch.nameBranch}</h2>
        <p className="text-lg text-gray-600 mt-2">{branch.address}</p>
        <p className="text-lg text-gray-600 mt-2">{branch.phone}</p>

        {/* Botones de navegación */}
        <div className="mt-6 flex flex-wrap gap-4 justify-start">
          <button
            onClick={() => navigate(`/empleados/verEmpleados`)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Ver Empleados
          </button>
          <button
            onClick={() => navigate(`/productos/menu`)}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Ver Productos
          </button>
          <button
            onClick={() => navigate(`/ventas/verVentas`)}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Ver Ventas
          </button>
        </div>
      </div>

      {/* Imágenes de la sucursal */}
      {branch.images && branch.images.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Imágenes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {branch.images.map((image) => (
              <div key={image._id} className="relative">
                <img 
                  alt="Branch Image" 
                  src={`${API}/${image.url}`}
                  className="w-full h-auto rounded-md" />
                
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes de la sucursal */}
      {branch.texts && branch.texts.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Mensajes</h3>
          <div className="mt-4">
            {branch.texts.map((text) => (
              <div key={text._id} className="flex justify-between items-center mb-4">
                <p className="text-lg text-gray-600">{text.content}</p>
                <button
                  onClick={() => handleDeleteText(text._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Componente de confirmación */}
      {showDeleteConfirmation && (
        <QuestionMessage
          message={`¿Estás seguro de que deseas eliminar este ${itemToDelete.type === 'image' ? 'imagen' : 'mensaje'}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Componente de éxito */}
      {deletionSuccess && (
        <AcceptMessage
          message={`${itemToDelete.type === 'image' ? 'Imagen' : 'Mensaje'} eliminado exitosamente.`}
          onAccept={handleSuccessAccept}
        />
      )}

      {/* Componente de error */}
      {deletionError && (
        <AcceptMessage
          message="Hubo un error al eliminar el item. Inténtalo de nuevo más tarde."
          onAccept={handleErrorAccept}
        />
      )}
    </div>
  );
};

export default ViewBranchPage;
