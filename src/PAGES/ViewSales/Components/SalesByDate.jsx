import { useState } from 'react';
import { format } from 'date-fns';
import { useBranch } from "../../../CONTEXTS/BranchContext.tsx";
import { getSalesByDateRequest } from '../../../api/branch.js';
import SalesList from './SalesList'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalesByDate = ({ setError, setViewSale }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const { selectedBranch } = useBranch();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = async (saleDate) => {
    setSelectedDate(saleDate);
    if (!saleDate || !selectedBranch) return;
  
    const formattedDate = format(saleDate, 'yyyy-MM-dd');
    const branchName = typeof selectedBranch === 'string' ? selectedBranch : selectedBranch.nameBranch;
  
    try {
      console.log('Formatted Date:', formattedDate);
      console.log('Branch Name:', branchName);
      const response = await getSalesByDateRequest(formattedDate, branchName);
      setSales(response.data.sales || []);
    } catch (error) {
      console.error('Error:', error);
      setError(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Seleccionar Fecha</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        className="border rounded-md p-2 mb-4"
      />
      {sales.length > 0 ? (
        <SalesList sales={sales} setViewSale={setViewSale} />
      ) : (
        <p>No hay ventas para esta fecha.</p>
      )}
    </div>
  );
};

export default SalesByDate;
