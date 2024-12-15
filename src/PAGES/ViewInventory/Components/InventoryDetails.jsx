import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { getInventoryByIdRequest } from "../../../api/branch.js";
import LoadingMessage from "../../../GENERALCOMPONENTS/LoandingMessage.jsx";

const InventoryDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventoryDetails();
  }, [id]);

  const loadInventoryDetails = async () => {
    try {
      const response = await getInventoryByIdRequest(
        location.state.branchName,
        id
      );
      setInventory(response.data.inventory);
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMovementsByType = (movements) => {
    return movements.reduce((acc, mov) => {
      switch (mov.type) {
        case 'sale':
          acc.sales = (acc.sales || 0) + Math.abs(mov.quantity);
          break;
        case 'purchase':
          acc.purchases = (acc.purchases || 0) + Math.abs(mov.quantity);
          break;
        case 'adjustment':
          if (mov.quantity > 0) {
            acc.adjustments.positive = (acc.adjustments.positive || 0) + mov.quantity;
          } else {
            acc.adjustments.negative = (acc.adjustments.negative || 0) + Math.abs(mov.quantity);
          }
          break;
      }
      return acc;
    }, { sales: 0, purchases: 0, adjustments: { positive: 0, negative: 0 } });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            Volver
          </button>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <FaPrint className="inline-block mr-2" />
              Imprimir
            </button>
            {inventory.status === 'open' && (
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                <FaEdit className="inline-block mr-2" />
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Detalles del Inventario</h2>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              inventory.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {inventory.status === 'open' ? 'Abierto' : 'Cerrado'}
            </span>
            <span className="text-gray-600">
              {new Date(inventory.date).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Empleados:</h3>
          <div className="flex flex-wrap gap-2">
            {inventory.employees.map((emp, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full">
                {emp.name}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingrediente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Inicial
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compras
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ajustes (+)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ajustes (-)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Final
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.ingredients.map((ingredient) => {
                const movements = calculateMovementsByType(ingredient.movements);
                const unit = ingredient.movements[0]?.unit || '';
                
                return (
                  <tr key={ingredient._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {ingredient.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {ingredient.initialStock} {unit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-red-600">
                      {movements.sales > 0 ? `-${movements.sales.toFixed(2)} ${unit}` : `0.00 ${unit}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-green-600">
                      {movements.purchases > 0 ? `+${movements.purchases.toFixed(2)} ${unit}` : `0.00 ${unit}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-600">
                      {movements.adjustments.positive > 0 
                        ? `+${movements.adjustments.positive.toFixed(2)} ${unit}` 
                        : `0.00 ${unit}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-yellow-600">
                      {movements.adjustments.negative > 0 
                        ? `-${movements.adjustments.negative.toFixed(2)} ${unit}` 
                        : `0.00 ${unit}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {ingredient.finalStock} {unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {inventory.observations && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Observaciones:</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">
              {inventory.observations}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDetails;