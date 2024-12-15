import { useState, useEffect } from 'react';
import { useBranch } from '../../../CONTEXTS/BranchContext';
import { getIngredientsByBranchRequest, removeIngredientFromBranchRequest } from '../../../api/branch';
import { FaCubes, FaTrash } from 'react-icons/fa';
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage.tsx";
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage.jsx";

const ViewIngredientsGrid = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedBranch } = useBranch();
  const [showAccept, setShowAccept] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const fetchIngredients = async () => {
    if (!selectedBranch) {
      setMessage("No hay sucursal seleccionada");
      setShowAccept(true);
      return;
    }

    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    try {
      setIsLoading(true);
      const response = await getIngredientsByBranchRequest(branchName);
      setIngredients(response.data.ingredients);
    } catch (error) {
      console.error("Error al obtener los ingredientes:", error);
      setMessage("Error al cargar los ingredientes. Por favor, intente nuevamente.");
      setShowAccept(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [selectedBranch]);

  const handleDeleteClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    setMessage(`¿Está seguro que desea eliminar el ingrediente ${ingredient.name}?`);
    setShowQuestion(true);
  };

  const handleDeleteConfirm = async () => {
    setShowQuestion(false);
    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    try {
      await removeIngredientFromBranchRequest({
        nameBranch: branchName,
        ingredientId: selectedIngredient._id
      });
      
      setMessage("Ingrediente eliminado exitosamente");
      setShowAccept(true);
      await fetchIngredients();
    } catch (error) {
      setMessage("Error al eliminar el ingrediente. Por favor, intente nuevamente.");
      setShowAccept(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Insumos Registrados</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative"
          >
            <button
              onClick={() => handleDeleteClick(ingredient)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              title="Eliminar ingrediente"
            >
              <FaTrash />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
                <FaCubes className="text-3xl text-red-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {ingredient.name}
              </h2>
              
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Stock Actual:</span>
                  <span className="font-medium">
                    {ingredient.currentStock} {ingredient.unit}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Costo por {ingredient.unit}:</span>
                  <span className="font-medium">{ingredient.cost} BS</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unidad de Medida:</span>
                  <span className="font-medium">{ingredient.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showQuestion && (
        <QuestionMessage
          message={message}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowQuestion(false)}
        />
      )}
      {showAccept && (
        <AcceptMessage
          message={message}
          onAccept={() => setShowAccept(false)}
        />
      )}
    </div>
  );
};

export default ViewIngredientsGrid;