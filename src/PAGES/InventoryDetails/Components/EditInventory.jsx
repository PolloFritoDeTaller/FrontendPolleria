import { useState, useEffect } from 'react';
import { useBranch } from '../../../CONTEXTS/BranchContext';
import { 
  updateBranchInventoryRequest,
  closeInventoryToBranchRequest
} from '../../../api/branch';
import { FaBox, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const EditInventory = ({ inventory, onSave, onCancel }) => {
  const { selectedBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddMovement, setShowAddMovement] = useState(null); // ingredientId del ingrediente seleccionado
  const [formData, setFormData] = useState({
    ingredients: inventory.ingredients.map(ing => ({
      ...ing,
      newMovement: {
        type: 'adjustment',
        quantity: 0,
        reference: ''
      }
    })),
    observations: inventory.observations || ''
  });

  const handleAddMovement = (ingredientId) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => {
        if (ing.ingredientId === ingredientId) {
          const quantity = parseFloat(ing.newMovement.quantity);
          if (quantity === 0 || !ing.newMovement.reference) return ing;

          const newMovement = {
            date: new Date(),
            type: ing.newMovement.type,
            ingredientId: ing.ingredientId,
            ingredientName: ing.name,
            quantity: ing.newMovement.type === 'loss' ? -Math.abs(quantity) : quantity,
            unit: 'kg',
            reference: ing.newMovement.reference
          };

          // Calcular nuevo stock final
          const totalMovements = [...(ing.movements || []), newMovement]
            .reduce((sum, mov) => sum + mov.quantity, 0);
          
          return {
            ...ing,
            movements: [...(ing.movements || []), newMovement],
            finalStock: ing.initialStock + totalMovements,
            newMovement: { type: 'adjustment', quantity: 0, reference: '' }
          };
        }
        return ing;
      })
    }));
    setShowAddMovement(null);
  };

  const handleRemoveMovement = (ingredientId, movementIndex) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => {
        if (ing.ingredientId === ingredientId) {
          const updatedMovements = [...ing.movements];
          updatedMovements.splice(movementIndex, 1);
          
          // Recalcular stock final
          const totalMovements = updatedMovements.reduce((sum, mov) => sum + mov.quantity, 0);
          
          return {
            ...ing,
            movements: updatedMovements,
            finalStock: ing.initialStock + totalMovements
          };
        }
        return ing;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedBranch) {
      setError('Por favor, seleccione una sucursal');
      return;
    }
  
    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;
  
    try {
      setIsLoading(true);
      setError(null);
  
      const updateData = {
        nameBranch: branchName,
        ingredients: formData.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          name: ing.name,
          initialStock: ing.initialStock,
          finalStock: ing.finalStock,
          movements: ing.movements
        })),
        observations: formData.observations
      };
  
      // Primero actualizamos el inventario
      const updateResponse = await updateBranchInventoryRequest(inventory._id, updateData);
      
      // Luego cerramos el inventario
      if (updateResponse.data && updateResponse.data.success) {
        await closeInventoryToBranchRequest({
          nameBranch: branchName,
          inventoryId: inventory._id
        });
        
        onSave({
          ...updateResponse.data.inventory,
          status: 'closed'
        });
      } else {
        throw new Error('Error al actualizar el inventario');
      }
  
    } catch (error) {
      console.error('Error:', error);
      setError('Error al guardar los cambios. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaBox className="text-gray-500" />
            <h3 className="text-lg font-medium">Inventario del Día</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ingrediente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock Inicial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Movimientos
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.ingredients.map((ing) => (
                <>
                  <tr key={ing.ingredientId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ing.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ing.initialStock} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {ing.finalStock.toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {ing.movements.map((mov, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className={`${mov.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {mov.quantity} kg
                            </span>
                            <span className="text-gray-500 mx-2">-</span>
                            <span className="text-gray-600">{mov.reference}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMovement(ing.ingredientId, index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAddMovement(ing.ingredientId)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaPlus className="mr-2" size={12} />
                        Agregar Movimiento
                      </button>
                    </td>
                  </tr>
                  {showAddMovement === ing.ingredientId && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <select
                            value={ing.newMovement.type}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              ingredients: prev.ingredients.map(i => 
                                i.ingredientId === ing.ingredientId 
                                  ? {...i, newMovement: {...i.newMovement, type: e.target.value}}
                                  : i
                              )
                            }))}
                            className="rounded-md border-gray-300"
                          >
                            <option value="loss">Pérdida</option>
                            <option value="adjustment">Ajuste</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Cantidad"
                            value={ing.newMovement.quantity}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              ingredients: prev.ingredients.map(i => 
                                i.ingredientId === ing.ingredientId 
                                  ? {...i, newMovement: {...i.newMovement, quantity: e.target.value}}
                                  : i
                              )
                            }))}
                            className="w-32 rounded-md border-gray-300"
                          />
                          <input
                            type="text"
                            placeholder="Referencia"
                            value={ing.newMovement.reference}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              ingredients: prev.ingredients.map(i => 
                                i.ingredientId === ing.ingredientId 
                                  ? {...i, newMovement: {...i.newMovement, reference: e.target.value}}
                                  : i
                              )
                            }))}
                            className="flex-1 rounded-md border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddMovement(ing.ingredientId)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Agregar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observaciones */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label className="block">
          <span className="text-gray-700">Observaciones Finales</span>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            rows="3"
          />
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <FaSave />
          {isLoading ? 'Guardando...' : 'Verificar y Cerrar Inventario'}
        </button>
      </div>
    </form>
  );
};

export default EditInventory;