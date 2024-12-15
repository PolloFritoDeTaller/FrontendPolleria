import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importa el estilo CSS del datepicker
import { getSalesByHourRequest } from '../../../api/sale'; // Asegúrate de que esta función esté definida en tu API
import SalesList from './SalesList'; // Asegúrate de que la ruta sea correcta

const SalesByHour = ({ setError, setViewSale }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [sales, setSales] = useState([]);

  const handleTimeChange = async () => {
    // Formatear las horas
    const formattedStartTime = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    try {
      const response = await getSalesByHourRequest(formattedStartTime, formattedEndTime);
      setSales(response.data);
    } catch (error) {
      setError("Error al obtener las ventas por hora");
      console.error("Error fetching sales by hour:", error);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    handleTimeChange();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Seleccionar Rango de Horas</h2>
      <form onSubmit={handleFilter} className="flex space-x-4">
        <div>
          <label>Hora de Inicio:</label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30} // Intervalo de 30 minutos
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            className="border rounded-md p-2 mb-4"
          />
        </div>
        <div>
          <label>Hora de Fin:</label>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30} // Intervalo de 30 minutos
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            className="border rounded-md p-2 mb-4"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Filtrar
        </button>
      </form>
      {sales.length > 0 ? (
        <SalesList sales={sales} setViewSale={setViewSale} />
      ) : (
        <p>No hay ventas para este rango de horas.</p>
      )}
    </div>
  );
};

export default SalesByHour;
