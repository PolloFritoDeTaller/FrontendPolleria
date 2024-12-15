import { useState } from "react";
import EmployeeForm from "./Components/EmployeeForm";
import EmployeePreview from "./Components/EmployeePreview";

const RegisterEmployee = () => {
  const [form, setForm] = useState({});

  const handleFormChange = (updatedForm) => {
    setForm(updatedForm);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Componente de Formulario */}
      <div className="md:w-6/12 w-full max-h-screen">
        <EmployeeForm onFormChange={handleFormChange} />
      </div>

      {/* Componente de Vista Previa */}
      <div className="md:w-6/12 w-full max-h-screen">
        <EmployeePreview form={form} />
      </div>
    </div>
  );
};

export default RegisterEmployee;
