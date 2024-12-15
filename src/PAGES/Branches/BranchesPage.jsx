import { useState, useEffect } from "react";
import BranchList from "./Components/BranchList";
import RegisterBranch from "./Components/RegisterBranch";
import { FaImage, FaTextWidth, FaEdit } from "react-icons/fa";
import { addImageToBranchesRequest, addTextToBranchesRequest, getBranchsRequest } from "../../api/branch";
import { useBranch } from "../../CONTEXTS/BranchContext";

const BranchesPage = () => {
  const [showManageBranches, setShowManageBranches] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]); // Almacena las sucursales seleccionadas
  const [imageFile, setImageFile] = useState(null); // Almacena la imagen seleccionada
  const [textContent, setTextContent] = useState(""); // Almacena el texto ingresado
  const [branches, setBranches] = useState([]); // Almacena las sucursales obtenidas desde la API
  const [loading, setLoading] = useState(false);

  // Función para obtener las sucursales desde la API
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await getBranchsRequest();
        setBranches(response.data);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  // Función para gestionar la visibilidad de la sección
  const handleManageBranchesClick = () => {
    setShowManageBranches(!showManageBranches);
    setSelectedOption(null); // Limpiar la selección si se cierra la sección
    setSelectedBranches([]); // Limpiar las sucursales seleccionadas
    setImageFile(null); // Limpiar la imagen seleccionada
    setTextContent(""); // Limpiar el contenido de texto
  };

  // Función para manejar la selección de la imagen
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Almacenar la imagen seleccionada
  };

  // Función para manejar la selección de sucursales
  const handleBranchSelection = (branchId) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  // Función para seleccionar todas las sucursales
  const handleSelectAllBranches = () => {
    setSelectedBranches(branches.map((branch) => branch._id));
  };

  // Función para manejar el texto
  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleConfirm = async () => {
    if (
      (selectedOption === "image" &&
        imageFile &&
        selectedBranches.length > 0) ||
      (selectedOption === "text" &&
        textContent.trim().length > 0 &&
        selectedBranches.length > 0)
    ) {
      try {
        // Si seleccionó 'image' y hay una imagen
        if (selectedOption === "image" && imageFile) {
          await addImageToBranchesRequest(
            imageFile,
            selectedBranches.length === branches.length
              ? ["all"]
              : selectedBranches
          );
        }

        // Si seleccionó 'text' y hay contenido de texto
        if (selectedOption === "text" && textContent.trim().length > 0) {
          await addTextToBranchesRequest(
            textContent,
            selectedBranches.length === branches.length
              ? ["all"]
              : selectedBranches
          );
        }

        setShowManageBranches(false);
        setSelectedOption(null);
        setSelectedBranches([]);
        setImageFile(null);
        setTextContent("");

        alert("Acción confirmada correctamente");
      } catch (error) {
        console.error("Error al procesar la acción:", error);
        alert("Hubo un error al procesar la acción.");
      }
    }
  };

  // Función para cancelar la acción
  const handleCancel = () => {
    setShowManageBranches(false);
    setSelectedOption(null);
    setSelectedBranches([]); // Limpiar las sucursales seleccionadas
    setImageFile(null); // Limpiar la imagen seleccionada
    setTextContent(""); // Limpiar el contenido de texto
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Gestión de Sucursales
        </h1>

        <div className="text-center mb-8">
          <button
            onClick={handleManageBranchesClick}
            className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg"
          >
            <FaEdit className="inline-block mr-2" /> Gestionar Sucursales
          </button>
        </div>

        {/* Sección de gestión de sucursales */}
        {showManageBranches && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              ¿Qué deseas hacer?
            </h2>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setSelectedOption("image")}
                className={`${
                  selectedOption === "image" ? "bg-green-500" : "bg-green-400"
                } text-white py-3 px-8 rounded-full hover:bg-green-600 transition-all`}
              >
                <FaImage className="mr-2" /> Subir Imagen
              </button>
              <button
                onClick={() => setSelectedOption("text")}
                className={`${
                  selectedOption === "text" ? "bg-blue-500" : "bg-blue-400"
                } text-white py-3 px-8 rounded-full hover:bg-blue-600 transition-all`}
              >
                <FaTextWidth className="mr-2" /> Subir Texto
              </button>
            </div>

            {/* Selección de imagen */}
            {selectedOption === "image" && (
              <div className="mt-6">
                <input
                  type="file"
                  className="block w-full mb-4 p-2"
                  onChange={handleImageChange}
                />
                <label className="text-lg">
                  Selecciona las sucursales a las que deseas publicar esta
                  imagen
                </label>
                <button
                  onClick={handleSelectAllBranches}
                  className="bg-blue-500 text-white py-2 px-6 rounded-full mt-4 hover:bg-blue-600 transition-all"
                >
                  Todas las sucursales
                </button>
                <div className="mt-4">
                  {loading ? (
                    <p>Cargando sucursales...</p>
                  ) : (
                    branches.map((branch) => (
                      <div key={branch._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={branch._id}
                          checked={selectedBranches.includes(branch._id)}
                          onChange={() => handleBranchSelection(branch._id)}
                          className="mr-2"
                        />
                        <label htmlFor={branch._id} className="ml-2">
                          {branch.nameBranch}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Selección de texto */}
            {selectedOption === "text" && (
              <div className="mt-6">
                <textarea
                  value={textContent}
                  onChange={handleTextChange}
                  className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
                  rows="4"
                  maxLength={200}
                  pattern="\d{200}"
                  placeholder="Escribe tu texto aquí..."
                ></textarea>
                <label className="text-lg">
                  Selecciona las sucursales a las que deseas publicar este texto
                </label>
                <button
                  onClick={handleSelectAllBranches}
                  className="bg-blue-500 text-white py-2 px-6 rounded-full mt-4 hover:bg-blue-600 transition-all"
                >
                  Todas las sucursales
                </button>
                <div className="mt-4">
                  {loading ? (
                    <p>Cargando sucursales...</p>
                  ) : (
                    branches.map((branch) => (
                      <div key={branch._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={branch._id}
                          checked={selectedBranches.includes(branch._id)}
                          onChange={() => handleBranchSelection(branch._id)}
                          className="mr-2"
                        />
                        <label htmlFor={branch._id} className="ml-2">
                          {branch.nameBranch}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Botón de confirmación */}
            <div className="mt-8 text-center flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                disabled={
                  !(
                    selectedBranches.length > 0 &&
                    (textContent.trim().length > 0 || imageFile)
                  )
                }
                className={`${
                  !(
                    selectedBranches.length > 0 &&
                    (textContent.trim().length > 0 || imageFile)
                  )
                    ? "bg-gray-400"
                    : "bg-yellow-500"
                } text-white py-3 px-8 rounded-full hover:bg-yellow-600 transition-all`}
              >
                Confirmar
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white py-3 px-8 rounded-full hover:bg-gray-500 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de sucursales y registro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BranchList />
          <RegisterBranch />
        </div>
      </div>
    </div>
  );
};

export default BranchesPage;
