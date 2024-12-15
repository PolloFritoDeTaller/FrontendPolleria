import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getInventoryByIdRequest } from '../../api/branch';
import { useBranch } from '../../CONTEXTS/BranchContext';
import InventoryActions from './Components/InventoryActions';
import InventoryInfo from './Components/InventoryInfo';
import EditInventory from './Components/EditInventory';
import PrintInventory from './Components/PrintInventory';

const InventoryDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBranch } = useBranch();
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('view');

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      if (!selectedBranch) {
        navigate('/inventario/ver');
        return;
      }

      const branchName = typeof selectedBranch === 'string' 
        ? selectedBranch 
        : selectedBranch.nameBranch;

      try {
        setIsLoading(true);
        const response = await getInventoryByIdRequest(branchName, id);
        if (response.data && response.data.inventory) {
          setInventory(response.data.inventory);
        } else {
          throw new Error('No se encontró el inventario');
        }
      } catch (error) {
        console.error('Error al cargar los detalles del inventario:', error);
        setError('No se pudo cargar los detalles del inventario');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryDetails();
  }, [id, selectedBranch, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => navigate('/inventario/ver')}
            className="mt-4 text-red-600 hover:text-red-800 underline"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!inventory) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <InventoryActions 
        inventory={inventory} 
        mode={mode} 
        setMode={setMode}
      />
      
      {mode === 'view' && (
        <InventoryInfo inventory={inventory} />
      )}
      
      {mode === 'edit' && (
        <EditInventory 
          inventory={inventory} 
          onSave={async (updatedData) => {
            setInventory(updatedData);
            setMode('view');
          }}
          onCancel={() => setMode('view')}
        />
      )}
      
      {mode === 'print' && (
        <PrintInventory 
          inventory={inventory}
          onClose={() => setMode('view')}
        />
      )}
    </div>
  );
};

export default InventoryDetails;