import { useState, useEffect } from "react";
import BranchList from "./Components/BranchList";
import RegisterBranch from "./Components/RegisterBranch";
import { FaImage, FaTextWidth, FaEdit } from "react-icons/fa";
import { addImageToBranchesRequest, addTextToBranchesRequest, getBranchsRequest } from "../../api/branch";
import { useBranch } from "../../CONTEXTS/BranchContext";
import CloudinaryUploadWidget from "../../GENERALCOMPONENTS/CloudinaryUploadWidget";

const BranchesPage = () => {
  const [showManageBranches, setShowManageBranches] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]); 
  const [imageUrl, setImageUrl] = useState(""); 
  const [textContent, setTextContent] = useState(""); 
  const [branches, setBranches] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleOnUpload = (error, result) => {
    if (error) {
      console.error("Error uploading image:", error);
      return;
    }
    
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
    }
  };

  const handleManageBranchesClick = () => {
    setShowManageBranches(!showManageBranches);
    setSelectedOption(null);
    setSelectedBranches([]);
    setImageUrl("");
    setTextContent("");
  };

  const handleBranchSelection = (branchId) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleSelectAllBranches = () => {
    setSelectedBranches(branches.map((branch) => branch._id));
  };

  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleConfirm = () => {
    if (
      (selectedOption === "image" && imageUrl && selectedBranches.length > 0) ||
      (selectedOption === "text" && textContent.trim().length > 0 && selectedBranches.length > 0)
    ) {
      setShowModal(true);
    }
  };

  const handleModalConfirm = async () => {
    try {
      if (selectedOption === "image" && imageUrl) {
        const imageData = {
          imageUrl: imageUrl,
          branchIds: selectedBranches.length === branches.length ? ["all"] : selectedBranches
        };
        
        console.log('Sending data:', imageData); // Para debug
        const response = await addImageToBranchesRequest(imageData);
        console.log('Response:', response); // Para debug
  
        // Resto del código...
        setShowManageBranches(false);
        setSelectedOption(null);
        setSelectedBranches([]);
        setImageUrl("");
        setTextContent("");
        setShowModal(false);
      }
  
      // ... resto del código para texto
    } catch (error) {
      console.error("Error detallado:", error.response?.data); // Para ver el error específico del servidor
      alert("Hubo un error al procesar la acción: " + (error.response?.data?.message || error.message));
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowManageBranches(false);
    setSelectedOption(null);
    setSelectedBranches([]);
    setImageUrl("");
    setTextContent("");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Gestión de Sucursales</h1>

        <div className="text-center mb-8">
          <button
            onClick={handleManageBranchesClick}
            className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg"
          >
            <FaEdit className="inline-block mr-2" /> Gestionar Sucursales
          </button>
        </div>

        {showManageBranches && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">¿Qué deseas hacer?</h2>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setSelectedOption("image")}
                className={`${selectedOption === "image" ? "bg-green-500" : "bg-green-400"} text-white py-3 px-8 rounded-full hover:bg-green-600 transition-all`}
              >
                <FaImage className="inline-block mr-2" /> Subir Imagen
              </button>
              <button
                onClick={() => setSelectedOption("text")}
                className={`${selectedOption === "text" ? "bg-blue-500" : "bg-blue-400"} text-white py-3 px-8 rounded-full hover:bg-blue-600 transition-all`}
              >
                <FaTextWidth className="inline-block mr-2" /> Subir Texto
              </button>
            </div>

            {selectedOption === "image" && (
              <div className="mt-6">
                <CloudinaryUploadWidget onUpload={handleOnUpload} />
                {imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-w-xs mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
                <label className="text-lg block mt-4">
                  Selecciona las sucursales a las que deseas publicar esta imagen
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

            {selectedOption === "text" && (
              <div className="mt-6">
                <textarea
                  value={textContent}
                  onChange={handleTextChange}
                  className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
                  rows="4"
                  maxLength={200}
                  placeholder="Escribe tu texto aquí..."
                ></textarea>
                <label className="text-lg">Selecciona las sucursales a las que deseas publicar este texto</label>
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

            <div className="mt-8 text-center flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                disabled={!(selectedBranches.length > 0 && (textContent.trim().length > 0 || imageUrl))}
                className={`${
                  !(selectedBranches.length > 0 && (textContent.trim().length > 0 || imageUrl))
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BranchList />
          <RegisterBranch />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar acción</h3>
            <p className="mb-6">¿Estás seguro de que deseas realizar esta acción?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModalCancel}
                className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleModalConfirm}
                className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesPage;