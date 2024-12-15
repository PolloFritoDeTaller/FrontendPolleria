// src/PAGES/ViewSales.jsx
import { useState } from 'react';
import SeeSalesMenuOption from './Components/SeeSalesMenuOption.jsx';
import ErrorModal from '../../GENERALCOMPONENTS/ErrorModal.jsx';
import TodaysSales from './Components/TodaysSales.jsx';
import AllSales from './Components/AllSales.jsx';
import SalesByDate from './Components/SalesByDate.jsx'; // Importa el nuevo componente
import SaleView from './Components/SaleView.jsx'; // Asegúrate de que también importes SaleView si lo necesitas
import SalesByHour from './Components/SalesByHour.jsx';

const SeeSales = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [viewSale, setViewSale] = useState(null);

  return (
    <div className="p-4">
      {viewSale && <SaleView sale={viewSale} onClose={() => setViewSale(null)} />}
      <h1 className="text-2xl font-semibold mb-4">Vista de Ventas</h1>
      <SeeSalesMenuOption setSelectedOption={setSelectedOption} />
      {selectedOption === 'todaysSales' && (
        <TodaysSales
          setError={setError}
        />
      )}
      {selectedOption === 'allSales' && (
        <AllSales
          setError={setError}
        />
      )}
      {selectedOption === 'date' && (
        <SalesByDate setError={setError} setViewSale={setViewSale} />
      )}
      {selectedOption === 'time' && (
        <SalesByHour setError={setError} setViewSale={setViewSale} />
      )}
      {error && <ErrorModal error={error} />}
    </div>
  );
};

export default SeeSales;
