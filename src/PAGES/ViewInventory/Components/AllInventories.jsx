import { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import { useBranch } from '../../../CONTEXTS/BranchContext';
import { getDailyInventoryByBranchRequest } from '../../../api/branch';
import LoadingMessage from '../../../GENERALCOMPONENTS/LoandingMessage';
import InventoryList from './InventoryList';

const AllInventories = ({ setError }) => {
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedBranch } = useBranch();

  const fetchAllInventories = async () => {
    try {
      const res = await getDailyInventoryByBranchRequest(selectedBranch);
      setInventories(res.data.inventories);
    } catch (error) {
      console.error(error);
      setError('Error al cargar los inventarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInventories();
  }, [selectedBranch]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchAllInventories();
  };

  if (isLoading) {
    return <LoadingMessage />;
  }

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl"></h2>
        <button onClick={handleRefresh} className="text-blue-500 hover:text-blue-700">
          <FaSync className="text-2xl" />
        </button>
      </div>
      <InventoryList inventories={inventories} />
    </div>
  );
};

export default AllInventories;