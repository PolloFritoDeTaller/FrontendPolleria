import { useState } from "react";
import { FaListAlt, FaCalendarAlt, FaClock, FaTimes } from "react-icons/fa";

const SeeInventoryMenuOption = ({ setSelectedOption, initialOption }) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const menuOptions = [
    {
      id: 'allInventories',
      label: 'Todos los Inventarios',
      icon: FaListAlt,
      description: 'Ver lista completa de inventarios'
    },
    {
      id: 'date',
      label: 'Buscar por Fecha',
      icon: FaCalendarAlt,
      description: 'Buscar inventarios por fecha específica'
    },
    {
      id: 'todaysInventory',
      label: 'Inventario de Hoy',
      icon: FaClock,
      description: 'Ver inventarios del día actual'
    }
  ];

  const getCurrentOptionLabel = () => {
    const option = menuOptions.find(opt => opt.id === initialOption);
    return option ? option.label : 'Obtener Inventarios';
  };

  return (
    <div className="relative z-10 p-4 bg-white shadow-sm rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {getCurrentOptionLabel()}
        </h2>
        <button
          onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showOptionsMenu ? <FaTimes /> : <FaListAlt />}
          <span>Cambiar Vista</span>
        </button>
      </div>

      {showOptionsMenu && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {menuOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedOption(option.id);
                  setShowOptionsMenu(false);
                }}
                className={`w-full p-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                  initialOption === option.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon className={`w-5 h-5 ${
                    initialOption === option.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeeInventoryMenuOption;