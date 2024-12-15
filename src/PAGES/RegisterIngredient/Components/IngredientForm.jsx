import { useState } from 'react';
import { useBranch } from '../../../CONTEXTS/BranchContext.tsx';
import { registerIngredientToBranchRequest } from '../../../api/branch.js';
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage.jsx";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage.tsx";

const IngredientForm = () => {
  const { selectedBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    currentStock: '',
    cost: ''
  });

  const handleSubmitClick = (e) => {
    e.preventDefault();

    if (!selectedBranch) {
      setMessage("Por favor, seleccione una sucursal");
      setShowAccept(true);
      return;
    }

    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    if (!branchName) {
      setMessage("Error con el nombre de la sucursal");
      setShowAccept(true);
      return;
    }

    if (!form.name.trim()) {
      setMessage("Por favor, ingrese el nombre del ingrediente");
      setShowAccept(true);
      return;
    }

    if (form.currentStock < 0 || form.cost < 0) {
      setMessage("Los valores no pueden ser negativos");
      setShowAccept(true);
      return;
    }

    setMessage(`¿Está seguro que desea registrar el ingrediente ${form.name}?`);
    setShowQuestion(true);
  };

  const handleSubmit = async () => {
    setShowQuestion(false);
    
    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    try {
      setIsLoading(true);
      const ingredientData = {
        nameBranch: branchName,
        ...form
      };

      const response = await registerIngredientToBranchRequest(ingredientData);
      
      if (response.data && response.data.success) {
        resetForm();
        setMessage("Ingrediente registrado exitosamente");
        setShowAccept(true);
      } else {
        throw new Error(response.data?.message || "Error al registrar el ingrediente");
      }
    } catch (error) {
      console.error("Error al registrar ingrediente:", error);
      setMessage(error.response?.data?.message || "Error al registrar el ingrediente");
      setShowAccept(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      unit: 'kg',
      currentStock: 0,
      cost: 0
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Registro de Ingrediente - {typeof selectedBranch === 'string' ? selectedBranch : selectedBranch?.nameBranch}
        </h2>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmitClick} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nombre del Ingrediente
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                maxLength={30}
                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Ej: Pollo, Papas, Tomate..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Unidad de Medida
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="kg">Kilogramos (kg)</option>
                <option value="g">Gramos (g)</option>
                <option value="l">Litros (l)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="unidad">Unidad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Stock Actual
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.currentStock}
                onChange={(e) => setForm(prev => ({ ...prev, currentStock: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder={`Ingrese el stock en ${form.unit}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Costo por {form.unit}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm(prev => ({ ...prev, cost: e.target.value }))}
                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder={`Ingrese el costo por ${form.unit}`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white transition-colors duration-200 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              {isLoading ? 'Registrando...' : 'Registrar Ingrediente'}
            </button>
          </form>
        )}
      </div>

      {showQuestion && (
        <QuestionMessage
          message={message}
          onConfirm={handleSubmit}
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

export default IngredientForm;