import { useState } from 'react';
import SeeInventoryMenuOption from './Components/SeeInventoryMenuOption.jsx';
import ErrorModal from '../../GENERALCOMPONENTS/ErrorModal.jsx';
import TodaysInventory from './Components/TodaysInventory.jsx';
import AllInventories from './Components/AllInventories.jsx';
import InventoryByDate from './Components/InventoryByDate.jsx';

const ViewInventory = () => {
  const [selectedOption, setSelectedOption] = useState('allInventories');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Estado para forzar recarga del componente

  const refreshComponent = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Incrementa para forzar recarga
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Vista de Inventarios</h1>
      <SeeInventoryMenuOption 
        setSelectedOption={setSelectedOption}
        initialOption="allInventories"
      />
      {selectedOption === 'todaysInventory' && (
        <TodaysInventory key={refreshKey} setError={setError} />
      )}
      {selectedOption === 'allInventories' && (
        <AllInventories key={refreshKey} setError={setError} />
      )}
      {selectedOption === 'date' && (
        <InventoryByDate key={refreshKey} setError={setError} />
      )}
      {error && <ErrorModal error={error} key={refreshKey} setError={setError} refreshComponent={refreshComponent} />}
    </div>
  );
};

export default ViewInventory;
