import { useState, useEffect } from 'react';

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

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Cliente</th>
            <th className="border border-gray-300 p-2 text-left">CI</th>
            <th className="border border-gray-300 p-2 text-left">Monto Total</th>
            <th className="border border-gray-300 p-2 text-left">Fecha</th>
            <th className="border border-gray-300 p-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {salesWithStatus.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No hay ventas disponibles
              </td>
            </tr>
          ) : (
            salesWithStatus.map((sale) => (
              <tr key={sale._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{sale.clientName}</td>
                <td className="border border-gray-300 p-2">{sale.clientCI}</td>
                <td className="border border-gray-300 p-2">{sale.totalAmount}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesList;
