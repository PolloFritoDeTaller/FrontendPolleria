import { useState } from 'react';
import SeeInventoryMenuOption from './Components/SeeInventoryMenuOption.jsx';
import ErrorModal from '../../GENERALCOMPONENTS/ErrorModal.jsx';
import TodaysInventory from './Components/TodaysInventory.jsx';
import AllInventories from './Components/AllInventories.jsx';
import InventoryByDate from './Components/InventoryByDate.jsx';

const ViewInventory = () => {
  const [selectedOption, setSelectedOption] = useState('allInventories');
  const [error, setError] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Vista de Inventarios</h1>
      <SeeInventoryMenuOption 
        setSelectedOption={setSelectedOption}
        initialOption="allInventories"
      />
      {selectedOption === 'todaysInventory' && (
        <TodaysInventory setError={setError} />
      )}
      {selectedOption === 'allInventories' && (
        <AllInventories setError={setError} />
      )}
      {selectedOption === 'date' && (
        <InventoryByDate setError={setError} />
      )}
      {error && <ErrorModal error={error} />}
    </div>
  );
};

export default ViewInventory;