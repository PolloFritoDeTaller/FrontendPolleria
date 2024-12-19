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
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CI
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto Total
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {salesWithStatus.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No hay ventas disponibles
              </td>
            </tr>
          ) : (
            salesWithStatus.map((sale) => (
              <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.clientCI}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.totalAmount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(sale.saleDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    onClick={() => handleStatusClick(sale._id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${sale.status === SALE_STATUSES.IN_PROGRESS
                        ? 'bg-yellow-200 text-yellow-800'
                        : sale.status === SALE_STATUSES.FINISHED
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {sale.status}
                  </span>
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
