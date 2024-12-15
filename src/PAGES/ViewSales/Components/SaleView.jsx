import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingMessage from "../../../GENERALCOMPONENTS/LoandingMessage.jsx";
import { getSaleRequest } from "../../../api/sale.js";
import { FaPrint, FaEdit, FaTrashAlt } from "react-icons/fa";

const SaleView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sale, setSale] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [authAction, setAuthAction] = useState(null); // 'edit' or 'delete'
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para redireccionar

  const fetchSale = async () => {
    try {
      const res = await getSaleRequest(id);
      setSale(res.data);
    } catch (error) {
      console.log(error);
      // Manejo del error si la venta no se encuentra
      if (error.response && error.response.status === 404) {
        navigate('/404'); // Redirige a la página 404
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    if (authAction === 'edit') {
      // Lógica para editar la venta
      setShowAuthModal(false); // Cierra el modal después de la autenticación
    } else if (authAction === 'delete') {
      setShowAuthModal(false); // Cierra el modal después de la autenticación
      setShowConfirmModal(true); // Muestra el modal de confirmación
    }
  };

  

  const handleEdit = () => {
    setAuthAction('edit');
    setShowAuthModal(true);
  };

  const handleDelete = () => {
    setAuthAction('delete');
    setShowAuthModal(true);
  };

  useEffect(() => {
    fetchSale();
  }, [id]);

  if (isLoading) return <LoadingMessage />;

  if (!sale) return <div>Venta no encontrada</div>; // O redirige a una página 404

  return (
    <>
      <div className="max-w-2xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden p-6">
        <div className="mb-4 text-center">
          <p className="text-md font-semibold text-gray-700">
            Fecha: {new Date(sale.date).toLocaleDateString()} - Hora: {new Date(sale.date).toLocaleTimeString()}
          </p>
          <p className="text-md font-semibold text-gray-700">Cliente: {sale.client}</p>
          <p className="text-md font-semibold text-gray-700">CI: {sale.ci}</p>
        </div>
        <div className="border-t border-gray-200 mt-4">
          <h2 className="text-lg leading-tight mt-4 mb-2">Productos:</h2>
          <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 text-center">
            <span>Nombre</span>
            <span>Precio (BS)</span>
            <span>Cantidad</span>
            <span>Total (BS)</span>
          </div>
          {sale.products.map((product, index) => (
            <div key={index} className={`grid grid-cols-4 gap-4 py-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
              <span>{product.name}</span>
              <span className="text-center">{product.price}</span>
              <span className="text-center">{product.quantity}</span>
              <span className="text-center">{(product.price * product.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4">
          <h2 className="text-lg leading-tight mt-4">Monto Total: {sale.totalAmount} BS</h2>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2">
            <FaPrint />
            <span>Imprimir Factura</span>
          </button>
          <button onClick={handleEdit} className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center space-x-2">
            <FaEdit />
            <span>Editar</span>
          </button>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-2">
            <FaTrashAlt />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
      {showAuthModal && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      
      </div>}
      {showConfirmModal && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
       
      </div>}
    </>
  );
};

export default SaleView;
