import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const getStatusColor = (status) => {
  switch (status) {
    case SALE_STATUSES.IN_PROGRESS:
      return 'bg-yellow-200 text-yellow-800';
    case SALE_STATUSES.FINISHED:
      return 'bg-green-200 text-green-800';
    case SALE_STATUSES.CANCELLED:
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const SalesList = ({ sales, setViewSale }) => {
  const [salesWithStatus, setSalesWithStatus] = useState([]);

  useEffect(() => {
    // Cargar estados guardados del localStorage
    const savedStatuses = JSON.parse(localStorage.getItem('salesStatuses') || '{}');
    
    // Combinar las ventas con sus estados guardados o el estado por defecto
    const updatedSales = sales.map(sale => ({
      ...sale,
      status: savedStatuses[sale._id] || SALE_STATUSES.IN_PROGRESS
    }));
    
    setSalesWithStatus(updatedSales);
  }, [sales]);

  const handleStatusClick = (e, saleId) => {
    e.preventDefault(); // Prevenir la navegación del Link
    e.stopPropagation(); // Prevenir la propagación del evento

    setSalesWithStatus(prevSales => {
      const updatedSales = prevSales.map(sale => {
        if (sale._id === saleId) {
          const nextStatus = getNextStatus(sale.status);
          return { ...sale, status: nextStatus };
        }
        return sale;
      });

      // Guardar estados actualizados en localStorage
      const statusMap = updatedSales.reduce((acc, sale) => {
        acc[sale._id] = sale.status;
        return acc;
      }, {});
      localStorage.setItem('salesStatuses', JSON.stringify(statusMap));

      return updatedSales;
    });
  };

  return (
    <div className="overflow-y-auto h-96 border-t border-b">
      <div className="flex justify-between items-center p-2 bg-gray-200 font-bold">
        <span className="w-1/5">Cliente</span>
        <span className="w-1/5">CI</span>
        <span className="w-1/5">Monto Total</span>
        <span className="w-1/5">Fecha</span>
        <span className="w-1/5">Estado</span>
      </div>
      {salesWithStatus.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No hay ventas disponibles</div>
      ) : (
        salesWithStatus.map((sale) => (
          <Link key={sale._id} to={`/sales/seeSales/viewSale/${sale._id}`}>
            <div className="flex justify-between items-center border-b p-2 hover:bg-gray-100">
              <span className="w-1/5 truncate">{sale.clientName}</span>
              <span className="w-1/5 truncate">{sale.clientCI}</span>
              <span className="w-1/5 truncate">{sale.totalAmount}</span>
              <span className="w-1/5 truncate">
                {new Date(sale.saleDate).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => handleStatusClick(e, sale._id)}
                className={`w-1/5 px-3 py-1 rounded-full text-sm font-medium text-center ${getStatusColor(sale.status)}`}
              >
                {sale.status}
              </button>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default SalesList;