import { useState } from "react";
import EmployeesFilterPanel from "./components/EmployeesFilterPanel";
import ViewEmployeesForm from "./components/ViewEmployeesForm";

const ViewEmployees = () => {
  const [form, setForm] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    salaryRange: { min: '', max: '' },
    contractStatus: 'all',
    role: 'all'
  });

  const handleFormChange = (updatedForm) => {
    setForm(updatedForm);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="relative w-full">
      {/* Panel de Filtros flotante (ahora a la derecha) */}
      <EmployeesFilterPanel 
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
      />

      {/* Contenido principal centrado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ViewEmployeesForm 
          onFormChange={handleFormChange} 
          activeFilters={activeFilters} 
        />
      </div>
    </div>
  );
};

export default ViewEmployees;
