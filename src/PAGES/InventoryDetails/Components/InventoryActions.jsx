import { useNavigate } from 'react-router-dom';
import { FaPrint, FaEdit, FaArrowLeft } from "react-icons/fa";

const InventoryActions = ({ inventory, mode, setMode }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center justify-between">
      <button 
        onClick={() => navigate('/inventarios/verInventarios')}
        className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
      >
        <FaArrowLeft /> Volver
      </button>
      
      {mode === 'view' && (
        <div className="flex gap-4">
          <button 
            onClick={() => setMode('print')}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPrint /> Imprimir
          </button>
          {/*{inventory.status === 'open' && (
            <button 
              onClick={() => setMode('edit')}
              className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaEdit /> Editar
            </button>
          )}*/}
        </div>
      )}
    </div>
  );
};

export default InventoryActions;