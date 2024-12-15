import { useState, useEffect } from 'react';
import { useBranch } from '../../../CONTEXTS/BranchContext';
import { 
  getIngredientsByBranchRequest,
  updateProductRecipeRequest 
} from '../../../api/branch';
import { FaPlus, FaMinus, FaUtensils } from 'react-icons/fa';
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage.jsx";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage.tsx";

const ProductRecipeForm = ({ product, onClose }) => {
  const { selectedBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(product.recipe || []);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [amount, setAmount] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      if (!selectedBranch) return;

      const branchName = typeof selectedBranch === 'string' 
        ? selectedBranch 
        : selectedBranch.nameBranch;

      try {
        setIsLoading(true);
        const response = await getIngredientsByBranchRequest(branchName);
        setIngredients(response.data.ingredients || []);
      } catch (error) {
        console.error('Error al obtener ingredientes:', error);
        setMessage('Error al cargar los ingredientes');
        setShowAccept(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, [selectedBranch]);

  const handleAddIngredient = () => {
    if (!selectedIngredient) {
      setMessage('Por favor seleccione un ingrediente');
      setShowAccept(true);
      return;
    }

    if (amount < 0) {
      setMessage('La cantidad no puede ser negativa');
      setShowAccept(true);
      return;
    }

    const ingredient = ingredients.find(i => i._id === selectedIngredient);
    if (!ingredient) return;

    if (recipe.some(r => r.ingredientId === selectedIngredient)) {
      setMessage('Este ingrediente ya está en la receta');
      setShowAccept(true);
      return;
    }

    setRecipe(prev => [...prev, {
      ingredientId: ingredient._id,
      name: ingredient.name,
      amount: Number(amount),
      unit: ingredient.unit
    }]);

    setSelectedIngredient('');
    setAmount('');
  };

  const handleRemoveIngredient = (ingredientId) => {
    const ingredient = recipe.find(r => r.ingredientId === ingredientId);
    setMessage(`¿Está seguro que desea eliminar ${ingredient.name} de la receta?`);
    setShowQuestion(true);
    setSelectedIngredient(ingredientId); // Guardamos temporalmente el ID para eliminar
  };

  const confirmRemoveIngredient = () => {
    setRecipe(prev => prev.filter(item => item.ingredientId !== selectedIngredient));
    setShowQuestion(false);
    setSelectedIngredient('');
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    
    if (!selectedBranch) {
      setMessage('Por favor, seleccione una sucursal');
      setShowAccept(true);
      return;
    }

    setMessage('¿Deseas modificar la receta?');
    setShowQuestion(true);
  };

  const handleSubmit = async () => {
    setShowQuestion(false);
    
    try {
      setIsLoading(true);
      const response = await updateProductRecipeRequest(product._id, { recipe });
      
      if (response.data && response.data.success) {
        setMessage('Receta actualizada exitosamente');
        setShowAccept(true);
        onClose();
      } else {
        throw new Error(response.data?.message || 'Error al actualizar la receta');
      }
    } catch (error) {
      console.error('Error al actualizar la receta:', error);
      setMessage(error.response?.data?.message || 'Error al actualizar la receta');
      setShowAccept(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaUtensils className="text-2xl text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Editar Receta: {product.nameProduct}
            </h2>
          </div>
        </div>

        {isLoading && !ingredients.length ? (
          <div className="text-center py-4">
            <p>Cargando ingredientes...</p>
          </div>
        ) : (
          <form className="space-y-6">
            {/* Agregar nuevo ingrediente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingrediente
                </label>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Seleccionar ingrediente</option>
                  {ingredients.map(ing => (
                    <option key={ing._id} value={ing._id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors duration-200 flex items-center justify-center disabled:bg-gray-400"
                >
                  <FaPlus className="mr-2" /> Agregar
                </button>
              </div>
            </div>

            {/* Lista de ingredientes en la receta */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <span className="mr-2">Ingredientes actuales</span>
                <span className="text-sm text-gray-500">
                  ({recipe.length} {recipe.length === 1 ? 'ingrediente' : 'ingredientes'})
                </span>
              </h3>
              
              {recipe.length === 0 ? (
                <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  No hay ingredientes en la receta
                </p>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200">
                  {recipe.map((item) => (
                    <div 
                      key={item.ingredientId}
                      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.amount} {item.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(item.ingredientId)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded-md transition-colors duration-200 
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {isLoading ? 'Guardando...' : 'Guardar Receta'}
              </button>
            </div>
          </form>
        )}
      </div>
      {showQuestion && (
        <QuestionMessage
          message={message}
          onConfirm={selectedIngredient ? confirmRemoveIngredient : handleSubmit}
          onCancel={() => {
            setShowQuestion(false);
            setSelectedIngredient('');
          }}
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

export default ProductRecipeForm;