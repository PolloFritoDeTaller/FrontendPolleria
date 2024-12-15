import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { deleteBranchRequest, getBranchsRequest, editBranchRequest } from "../../../api/branch";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage";
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage";

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null); // Estado para almacenar la sucursal seleccionada para eliminar
  const [isEditing, setIsEditing] = useState(false); // Estado para mostrar el modal de edición
  const [editedBranch, setEditedBranch] = useState({
    nameBranch: "",
    address: "",
    phone: ""
  }); // Datos del formulario de edición

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranchsRequest();
        setBranches(response.data);
      } catch (error) {
        setErrorMessage('Error al obtener las sucursales');
        console.error('Error al obtener las sucursales:', error);
      }
    };
    fetchBranches();
  }, []);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const resp = await deleteBranchRequest(id);
      setBranches(branches.filter(branch => branch._id !== id)); // Eliminar la sucursal de la lista
      setSuccessMessage('Sucursal eliminada exitosamente');
      setIsDeleting(false);
    } catch (error) {
      setErrorMessage('Error al eliminar la sucursal');
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBranch) {
      handleDelete(selectedBranch._id);
      setSelectedBranch(null); 
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setSelectedBranch(null); // Cancelar y limpiar la sucursal seleccionada
  };

  const handleEditBranch = async (e) => {
    e.preventDefault();
    try {
      const response = await editBranchRequest(selectedBranch._id, editedBranch);
      setBranches(branches.map((branch) => 
        branch._id === selectedBranch._id ? { ...branch, ...editedBranch } : branch
      ));
      setSuccessMessage('Sucursal actualizada exitosamente');
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Error al actualizar la sucursal');
      console.error('Error al actualizar la sucursal:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBranch({ ...editedBranch, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sucursales Creadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {branches.map((branch) => (
          <div key={branch._id} className="bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all">
            {/* Solo la tarjeta de la sucursal está dentro del Link */}
            <Link
              to={`/sucursal/${branch._id}`}
              className="block"
            >
              <h3 className="text-xl font-semibold text-gray-800">{branch.nameBranch}</h3>
              <p className="mt-2 text-gray-600">{branch.address}</p>
              <p className="mt-2 text-gray-500">{branch.phone}</p>
            </Link>

            {/* Contenedor de los botones de edición y eliminación */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedBranch(branch);
                  setEditedBranch({
                    nameBranch: branch.nameBranch,
                    address: branch.address,
                    phone: branch.phone
                  });
                  setIsEditing(true);
                }}
                className="text-yellow-500 hover:text-yellow-700"
              >
                <FaEdit className="text-xl" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedBranch(branch); // Almacenar la sucursal seleccionada
                  setIsDeleting(true); // Activar la confirmación de eliminación
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrashAlt className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensajes de error y éxito */}
      {errorMessage && (
        <AcceptMessage
          message={errorMessage}
          onAccept={() => setErrorMessage('')}
        />
      )}

      {successMessage && (
        <AcceptMessage
          message={successMessage}
          onAccept={() => {
            setSuccessMessage('');
            window.location.reload(); // Recargar la página al aceptar
          }}
        />
      )}

      {/* Mensaje de confirmación antes de eliminar */}
      {isDeleting && selectedBranch && (
        <QuestionMessage
          message="¿Estás seguro de que deseas eliminar esta sucursal?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Modal de edición de sucursal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Editar Sucursal</h3>
            <form onSubmit={handleEditBranch}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre de la Sucursal</label>
                <input
                  type="text"
                  name="nameBranch"
                  value={editedBranch.nameBranch}
                  onChange={handleChange}
                  maxLength={25}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={editedBranch.address}
                  onChange={handleChange}
                  maxLength={30}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="number"
                  name="phone"
                  value={editedBranch.phone}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchList;
