import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useBranch } from '../../../CONTEXTS/BranchContext';

const InventoryList = ({ inventories }) => {
  const navigate = useNavigate();
  const { selectedBranch } = useBranch();

  const handleViewDetails = (inventory) => {
    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;
    
    navigate(`/inventario/detalles/${inventory._id}`, {
      state: { 
        branchName: branchName
      }
    });
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleados
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventories.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No hay inventarios disponibles
              </td>
            </tr>
          ) : (
            inventories.map((inventory) => (
              <tr
                key={inventory._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(inventory.date), 'dd/MM/yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(inventory.date), 'HH:mm')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs overflow-hidden">
                    {inventory.employees.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {inventory.employees.map((emp, index) => (
                          <span 
                            key={emp.employeeCi}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100"
                          >
                            {emp.name}
                            {index < inventory.employees.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Sin empleados</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${inventory.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span className={`h-2 w-2 mr-1 rounded-full
                      ${inventory.status === 'open' 
                        ? 'bg-green-400' 
                        : 'bg-gray-400'
                      }`}
                    />
                    {inventory.status === 'open' ? 'Abierto' : 'Cerrado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleViewDetails(inventory)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;