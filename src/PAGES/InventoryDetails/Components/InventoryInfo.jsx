const InventoryInfo = ({ inventory }) => {
  const calculateMovementsByType = (movements) => {
    return movements.reduce((acc, mov) => {
      const quantity = Math.abs(mov.quantity);
      switch (mov.type) {
        case 'sale':
          acc.sales += quantity;
          break;
        case 'purchase':
          acc.purchases += quantity;
          break;
        case 'adjustment':
          if (mov.quantity < 0) {
            acc.adjustments += Math.abs(mov.quantity);
          }
          break;
      }
      return acc;
    }, { sales: 0, purchases: 0, adjustments: 0 });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        "<div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Detalles del Inventario</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            inventory.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {inventory.status === 'open' ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
        
        <p className="text-gray-600 mt-2">
          Fecha: {new Date(inventory.date).toLocaleDateString()} - 
          Hora: {new Date(inventory.date).toLocaleTimeString()}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Empleado Representante:</h2>
        <div className="flex flex-wrap gap-2">
          {inventory.employees.map((emp) => (
            <span 
              key={emp.employeeCi}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {emp.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Insumos del Inventario:</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingrediente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Inicial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ajustes
                </th>*/}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Final
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.ingredients.map((item) => {
                const movements = calculateMovementsByType(item.movements || []);
                const unit = 'kg';
                
                return (
                  <tr key={item.ingredientId}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.initialStock.toFixed(2)} {unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">
                      {movements.sales > 0 ? `-${movements.sales.toFixed(2)}` : '0.00'} {unit}
                    </td>
                    {/*<td className="px-6 py-4 whitespace-nowrap text-green-600">
                      {movements.purchases > 0 ? `+${movements.purchases.toFixed(2)}` : '0.00'} {unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-yellow-600">
                      {movements.adjustments > 0 ? `-${movements.adjustments.toFixed(2)}` : '0.00'} {unit}
                    </td>*/}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.finalStock.toFixed(2)} {unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {inventory.observations && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Observaciones:</h2>
          <p className="text-gray-700 bg-gray-50 p-4 rounded">{inventory.observations}</p>
        </div>
      )}
    </div>
  );
};

export default InventoryInfo;