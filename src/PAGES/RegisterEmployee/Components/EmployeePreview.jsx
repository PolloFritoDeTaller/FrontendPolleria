import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerEmployeeRequest } from "../../../api/employee";
import { addEmployeeToBranchRequest } from "../../../api/branch";

const EmployeePreview = ({ form }) => {
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const requiredFields = [
      "branchName", // Añadido branchName como campo obligatorio
      "name",
      "ci",
      "phone",
      "email",
      "password",
      "contractStart",
      "contractEnd",
      "salary",
      "role",
    ];
    const isComplete = requiredFields.every(
      (field) => form[field] && form[field] !== ""
    );

    setIsFormComplete(isComplete && (form.photo ? true : false));
  }, [form]);

  const handleSaveEmployee = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("branchName", form.branchName); // Aseguramos que el nombre de la sucursal se envíe
      formData.append("name", form.name);
      formData.append("ci", form.ci);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("contractStart", form.contractStart);
      formData.append("contractEnd", form.contractEnd);
      formData.append("salary", form.salary);
      formData.append("role", form.role);

      if (form.photo) formData.append("photo", form.photo);

      console.log("Datos del formulario:", formData); // Log para verificar datos antes de enviar
      const response = await addEmployeeToBranchRequest(formData); // Envío de formData

      if (!response) {
        throw new Error("Error al guardar el empleado");
      }

      setSuccessMessage("Empleado guardado exitosamente");
      setIsSubmitting(false);
      window.location.reload();
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("Hubo un problema al guardar el empleado");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-lg max-h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Vista Previa del Empleado
      </h2>
      <div className="space-y-4">
        {/* Mostrar los datos del formulario en la vista previa */}
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

        {/* Vista previa de la foto si está cargada */}
        {form.photo && (
          <div>
            <p className="font-medium">Foto:</p>
            <img
              src={URL.createObjectURL(form.photo)}
              alt="Foto del empleado"
              className="w-32 h-32 object-cover rounded-full border border-gray-300"
            />
          </div>
        )}

        {/* Botón para guardar el empleado */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSaveEmployee}
            disabled={!isFormComplete || isSubmitting}
            className={`p-2 rounded-md font-semibold ${
              !isFormComplete || isSubmitting
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            } text-white transition duration-300`}
          >
            {isSubmitting ? "Guardando..." : "Guardar Empleado"}
          </button>
        </div>

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <p className="text-green-600 font-semibold text-center">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 font-semibold text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeePreview;
