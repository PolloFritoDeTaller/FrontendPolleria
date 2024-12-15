import { FaPrint } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PrintInventory = ({ inventory, onClose }) => {
  const calculateMovementsByType = (movements) => {
    return movements.reduce((acc, mov) => {
      const quantity = Math.abs(mov.quantity);
      switch (mov.type) {
        case 'sale':
          acc.sales += quantity;
          break;
        case 'purchase':
          acc.purchases += quantity;
          break;
        case 'adjustment':
          if (mov.quantity < 0) {
            acc.adjustments += Math.abs(mov.quantity);
          }
          break;
      }
      return acc;
    }, { sales: 0, purchases: 0, adjustments: 0 });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Configuración inicial del documento
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Inventario", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    
    // Información del inventario
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Fecha y estado
    const formattedDate = format(new Date(inventory.date), "PPP 'a las' p", { locale: es });
    doc.text(`Fecha: ${formattedDate}`, 20, 35);
    doc.text(`Estado: ${inventory.status === 'open' ? 'Abierto' : 'Cerrado'}`, 20, 42);

    // Empleados
    doc.setFont("helvetica", "bold");
    doc.text("Empleados responsables:", 20, 52);
    doc.setFont("helvetica", "normal");
    const employeesList = inventory.employees.map(emp => emp.name).join(", ");
    doc.text(employeesList, 20, 59);

    // Tabla de ingredientes
    doc.autoTable({
      startY: 70,
      head: [["Ingrediente", "Stock Inicial", "Ventas", "Stock Final"]],
      body: inventory.ingredients.map((item) => {
        const movements = calculateMovementsByType(item.movements || []);
        return [
          item.name,
          `${item.initialStock.toFixed(2)} kg`,
          movements.sales > 0 ? `-${movements.sales.toFixed(2)} kg` : '0.00 kg',
          `${item.finalStock.toFixed(2)} kg`
        ];
      }),
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: 255,
        fontSize: 12,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 11,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 70 }
    });

    // Observaciones
    if (inventory.observations) {
      const finalY = doc.previousAutoTable.finalY || 70;
      doc.setFont("helvetica", "bold");
      doc.text("Observaciones:", 20, finalY + 15);
      doc.setFont("helvetica", "normal");
      doc.text(inventory.observations, 20, finalY + 22);
    }

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    // Guardar el PDF
    doc.save(`inventario_${format(new Date(inventory.date), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Vista previa de impresión</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Se generará un PDF con la siguiente información:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Fecha y hora del inventario</li>
            <li>Empleados responsables</li>
            <li>Lista de ingredientes y sus stocks</li>
            <li>Observaciones del inventario</li>
          </ul>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaPrint />
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintInventory;