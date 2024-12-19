import { useState } from "react";
import EmployeeForm from "./Components/EmployeeForm";
import EmployeePreview from "./Components/EmployeePreview";

const RegisterEmployee = () => {
  const [form, setForm] = useState({});

  const handleFormChange = (updatedForm) => {
    setForm(updatedForm);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-3xl mx-auto">
        <EmployeeForm onFormChange={handleFormChange} />
      </div>
    </div>
  );
};

export default RegisterEmployee;
