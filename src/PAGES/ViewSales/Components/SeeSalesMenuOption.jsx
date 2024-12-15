import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

const SeeSalesMenuOption = ({ setSelectedOption }) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleOptionsClick = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptionsMenu(false);
    // Aquí puedes agregar la lógica para manejar cada opción
    console.log(`Selected option: ${option}`);
  };

  return (
    <div className="p-4">
      <div className="relative z-10">
        <button
          onClick={handleOptionsClick}
          className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          <FaEllipsisV />
          <span>{showOptionsMenu ? 'Cerrar' : 'Obtener Ventas'}</span>
        </button>
        {showOptionsMenu && (
          <div className="absolute top-full left-0 mt-2 w-48 p-2 border rounded-lg bg-gray-50 shadow-md">
            <button
              onClick={() => handleOptionSelect('todaysSales')}
              className="w-full py-2 px-4 rounded-lg bg-white hover:bg-gray-100 text-left"
            >
              Hoy
            </button>
            <button
              onClick={() => handleOptionSelect('date')}
              className="w-full py-2 px-4 rounded-lg bg-white hover:bg-gray-100 text-left mt-1"
            >
              Obtener ventas por fecha
            </button>
            {/*<button
              onClick={() => handleOptionSelect('time')}
              className="w-full py-2 px-4 rounded-lg bg-white hover:bg-gray-100 text-left mt-1"
            >
              Obtener ventas por hora
            </button>
            */}
            <button
              onClick={() => handleOptionSelect('allSales')}
              className="w-full py-2 px-4 rounded-lg bg-white hover:bg-gray-100 text-left mt-1"
            >
              Obtener todas las ventas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeSalesMenuOption;
