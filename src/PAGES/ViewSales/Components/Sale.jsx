import React from 'react';
import { format } from 'date-fns';  // Asumiendo que estás usando date-fns para formatear fechas

const Sale = ({ sale }) => {
  const { clientName, totalAmount, saleDate, ci } = sale;  // Cambiado clientCI por ci

  let formattedDate = 'Fecha no disponible';  // Valor por defecto para fechas inválidas

  try {
    if (saleDate) {
      const parsedDate = new Date(saleDate);  // Intenta crear un objeto Date con el valor
      if (!isNaN(parsedDate)) {
        formattedDate = format(new Date(sale.saleDate), 'dd/MM/yyyy HH:mm');  // Formatea si es una fecha válida
      }
    }
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
  }

  return (
    <div className="flex justify-between items-center border-b p-2 cursor-pointer hover:bg-gray-100">
      <span className="w-1/4 truncate">{sale.clientName}</span>
      <span className="w-1/4 truncate">{sale.clientCI}</span>  {/* Cambiado clientCI por ci */}
      <span className="w-1/4 truncate">{sale.totalAmount}</span>
      <span className="w-1/4 truncate">{formattedDate}</span>
    </div>
  );
};

export default Sale;
