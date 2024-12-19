import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EmployeePreview = ({ form }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-lg max-h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Vista Previa del Empleado
      </h2>
      <div className="space-y-4">
        <p className="font-medium">Nombre: {form.name}</p>
        <p className="font-medium">CI: {form.ci}</p>
        <p className="font-medium">Celular: {form.phone}</p>
        <p className="font-medium">Email: {form.email}</p>
        <div className="flex items-center">
          <p className="font-medium">Contraseña: {showPassword && form.password}</p>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-blue-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <p className="font-medium">Sucursal: {form.branchName}</p>
        <p className="font-medium">
          Fecha de Inicio del Contrato: {form.contractStart}
        </p>
        <p className="font-medium">
          Fecha de Fin del Contrato: {form.contractEnd}
        </p>
        <p className="font-medium">Salario: {form.salary}</p>
        <p className="font-medium">Rol: {form.role}</p>

        {form.photo && (
          <div>
            <p className="font-medium">Foto:</p>
            <img
              src={form.photo}
              alt="Foto del empleado"
              className="w-32 h-32 object-cover rounded-full border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePreview;