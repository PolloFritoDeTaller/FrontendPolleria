import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const EmployeesFilterPanel = ({ onFilterChange, activeFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(activeFilters);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      salaryRange: { min: '', max: '' },
      contractStatus: 'all',
      role: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition duration-300"
      >
        <FaFilter size={16} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de filtros */}
          <div className="fixed right-16 top-1/2 -translate-y-1/2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filtrar Empleados</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition duration-300"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Rango de Salario (BS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.salaryRange.min}
                    onChange={(e) => handleFilterChange('salaryRange', { ...filters.salaryRange, min: e.target.value })}
                    className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-500"
                    placeholder="Mínimo"
                  />
                  <input
                    type="number"
                    value={filters.salaryRange.max}
                    onChange={(e) => handleFilterChange('salaryRange', { ...filters.salaryRange, max: e.target.value })}
                    className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-500"
                    placeholder="Máximo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Estado del Contrato
                </label>
                <select
                  value={filters.contractStatus}
                  onChange={(e) => handleFilterChange('contractStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-500"
                >
                  <option value="all">Todos</option>
                  <option value="active">Vigente</option>
                  <option value="expired">Vencido</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Rol
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-500"
                >
                  <option value="all">Todos</option>
                  <option value="Cajero">Cajero</option>
                  <option value="Cocinero">Cocinero</option>
                  <option value="Mesero">Mesero</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleClearFilters}
                  className="w-1/2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition duration-300"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="w-1/2 p-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-300"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeesFilterPanel;