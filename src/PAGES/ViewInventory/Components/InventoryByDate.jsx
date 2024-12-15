import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { useBranch } from '../../../CONTEXTS/BranchContext';
import { getInventoryByDateAndBranchRequest } from '../../../api/branch';
import InventoryList from './InventoryList';
import { FaCalendarAlt } from 'react-icons/fa';

registerLocale('es', es);

const InventoryByDate = ({ setError, setViewInventory }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedBranch } = useBranch();

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (!date) {
      setInventories([]);
      return;
    }

    if (!selectedBranch) {
      setError("Por favor seleccione una sucursal");
      return;
    }

    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await getInventoryByDateAndBranchRequest(branchName, formattedDate);
      const inventoryData = response.data.inventory 
        ? Array.isArray(response.data.inventory) 
          ? response.data.inventory 
          : [response.data.inventory] 
        : [];
      setInventories(inventoryData);
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
      setError("Error al obtener el inventario para la fecha seleccionada");
      setInventories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="relative">
      <input
        type="text"
        value={value || ''}
        onClick={onClick}
        className="w-full p-2 pl-10 border rounded-md cursor-pointer bg-white"
        placeholder="Seleccione una fecha"
        readOnly
      />
      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Buscar Inventario por Fecha</h2>
        <div className="max-w-xs">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            locale="es"
            maxDate={new Date()}
            customInput={<CustomInput />}
            isClearable
            placeholderText="Seleccione una fecha"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando inventarios...</p>
        </div>
      ) : (
        <>
          {inventories.length > 0 ? (
            <InventoryList 
              inventories={inventories}
              setViewInventory={setViewInventory}
            />
          ) : (
            <div className="text-center py-8">
              {selectedDate ? (
                <div className="text-gray-600">
                  <p className="mb-2">No se encontraron inventarios para el</p>
                  <p className="font-semibold">{format(selectedDate, 'dd MMMM yyyy', { locale: es })}</p>
                </div>
              ) : (
                <p className="text-gray-600">Seleccione una fecha para ver los inventarios</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InventoryByDate;