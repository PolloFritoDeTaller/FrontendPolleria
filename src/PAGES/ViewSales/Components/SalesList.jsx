import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SALE_STATUSES = {
  IN_PROGRESS: 'En Progreso',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado'
};

const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
    case SALE_STATUSES.IN_PROGRESS:
      return SALE_STATUSES.FINISHED;
    case SALE_STATUSES.FINISHED:
      return SALE_STATUSES.CANCELLED;
    case SALE_STATUSES.CANCELLED:
      return SALE_STATUSES.IN_PROGRESS;
    default:
      return SALE_STATUSES.IN_PROGRESS;
  }
};

const SalesList = ({ sales }) => {
  const [salesWithStatus, setSalesWithStatus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedStatuses = JSON.parse(localStorage.getItem('salesStatuses') || '{}');
    const updatedSales = sales.map((sale) => ({
      ...sale,
      status: savedStatuses[sale._id] || SALE_STATUSES.IN_PROGRESS
    }));
    setSalesWithStatus(updatedSales);
  }, [sales]);

  const handleStatusClick = (saleId) => {
    setSalesWithStatus((prevSales) => {
      const updatedSales = prevSales.map((sale) => {
        if (sale._id === saleId) {
          const nextStatus = getNextStatus(sale.status);
          return { ...sale, status: nextStatus };
        }
        return sale;
      });

      const statusMap = updatedSales.reduce((acc, sale) => {
        acc[sale._id] = sale.status;
        return acc;
      }, {});
      localStorage.setItem('salesStatuses', JSON.stringify(statusMap));

      return updatedSales;
    });
  };

  const handleViewDetails = (sale) => {
    navigate(`/sales/seeSales/viewSale/${sale._id}`);
  };

  return (
    <div className="overflow-y-auto h-96 border-t border-b">
      <div className="flex justify-between items-center p-2 bg-gray-200 font-bold">
        <span className="w-1/4">Cliente</span>
        <span className="w-1/4">CI</span>
        <span className="w-1/4">Monto Total</span>
        <span className="w-1/4">Acciones</span>
      </div>
      {salesWithStatus.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No hay ventas disponibles</div>
      ) : (
        salesWithStatus.map((sale) => (
          <div
            key={sale._id}
            className="flex justify-between items-center border-b p-2 hover:bg-gray-100"
          >
            <span className="w-1/4 truncate">{sale.clientName}</span>
            <span className="w-1/4 truncate">{sale.clientCI}</span>
            <span className="w-1/4 truncate">{sale.totalAmount}</span>
            <div className="w-1/4 flex items-center gap-2">
              <button
                onClick={() => handleStatusClick(sale._id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sale.status === SALE_STATUSES.IN_PROGRESS
                    ? 'bg-yellow-200 text-yellow-800'
                    : sale.status === SALE_STATUSES.FINISHED
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {sale.status}
              </button>
              <button
                onClick={() => handleViewDetails(sale)}
                className="px-3 py-1 text-white bg-blue-600 rounded-full text-sm hover:bg-blue-700 focus:outline-none"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SalesList;
