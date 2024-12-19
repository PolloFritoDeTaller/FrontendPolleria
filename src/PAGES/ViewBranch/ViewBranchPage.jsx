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
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletionError, setDeletionError] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await getBranchDetailsRequest(id);
        setBranch(response.data.branch);
      } catch (error) {
        console.error("Error al obtener los detalles de la sucursal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [id]);

  const handleDeleteImage = (imageId) => {
    setItemToDelete({ type: 'image', id: imageId });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteText = (textId) => {
    setItemToDelete({ type: 'text', id: textId });
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (itemToDelete.type === 'image') {
        await deleteBranchImage(id, itemToDelete.id);
        setBranch({
          ...branch,
          images: branch.images.filter((image) => image._id !== itemToDelete.id),
        });
      } else if (itemToDelete.type === 'text') {
        await deleteBranchText(id, itemToDelete.id);
        setBranch({
          ...branch,
          texts: branch.texts.filter((text) => text._id !== itemToDelete.id),
        });
      }
      setShowDeleteConfirmation(false);
      setDeletionSuccess(true);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      setDeletionError(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">{branch.nameBranch}</h2>
        <p className="text-lg text-gray-600 mt-2">{branch.address}</p>
        <p className="text-lg text-gray-600 mt-2">{branch.phone}</p>

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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Imágenes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {branch.images.map((image) => (
              <div key={image._id} className="relative group">
                <img 
                  src={image.url} // URL directa de Cloudinary
                  alt="Imagen de sucursal"
                  className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg">
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                  >
                    <FaTrashAlt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes de la sucursal */}
      {branch.texts && branch.texts.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mensajes</h3>
          <div className="space-y-4">
            {branch.texts.map((text) => (
              <div 
                key={text._id} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors duration-200"
              >
                <p className="text-lg text-gray-700">{text.content}</p>
                <button
                  onClick={() => handleDeleteText(text._id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-700"
                >
                  <FaTrashAlt className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes de confirmación y estado */}
      {showDeleteConfirmation && (
        <QuestionMessage
          message={`¿Estás seguro de que deseas eliminar ${itemToDelete.type === 'image' ? 'esta imagen' : 'este mensaje'}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {deletionSuccess && (
        <AcceptMessage
          message={`${itemToDelete.type === 'image' ? 'Imagen' : 'Mensaje'} eliminado exitosamente.`}
          onAccept={handleSuccessAccept}
        />
      )}

      {deletionError && (
        <AcceptMessage
          message="Hubo un error al eliminar el item. Por favor, inténtalo de nuevo."
          onAccept={handleErrorAccept}
        />
      )}
    </div>
  );
};

export default ViewBranchPage;