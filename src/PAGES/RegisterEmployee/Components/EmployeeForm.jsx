import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { useBranch } from "../../../CONTEXTS/BranchContext";
import { addEmployeeToBranchRequest } from "../../../api/branch.js";
import CloudinaryUploadWidget from "../../../GENERALCOMPONENTS/CloudinaryUploadWidget";
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage";
import EmployeePreview from "./EmployeePreview";

const EmployeeForm = () => {
  const { selectedBranch, setSelectedBranch, branches } = useBranch();
  const [imageUrl, setImageUrl] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const branchesRef = useRef(null);

  useEffect(() => {
    console.log('Selected Branch:', selectedBranch); // Para debugging
  }, [selectedBranch]);

  const [form, setForm] = useState({
    branchName: "",
    name: "",
    ci: "",
    phone: "",
    email: "",
    password: "",
    contractStart: "",
    contractEnd: "",
    salary: "",
    role: "",
    photo: ""
  });

  const handleOnUpload = (error, result) => {
    if (error) {
      setMessage(error.message);
      setShowAccept(true);
      return;
    }
    
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
      setForm(prevForm => ({
        ...prevForm,
        photo: result.info.secure_url
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 8) return;
    }
    if (name === "ci" && !/^\d*$/.test(value)) return;
    if (name === "salary" && value < 0) return;

    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
      branchName: selectedBranch
    }));
  };

  const handleBranchSelect = (branchName) => {
    console.log('Seleccionando sucursal:', branchName);
    const formattedBranchName = branchName.toLowerCase(); // Convertir a minúsculas
    setForm(prevForm => ({
      ...prevForm,
      branchName: formattedBranchName
    }));
    setSelectedBranch(formattedBranchName);
    setShowBranches(false);
  };

  const handleConfirmEmployee = (event) => {
    event.preventDefault();
    setMessage(`¿Estás seguro que deseas registrar al empleado ${form.name} en la sucursal ${selectedBranch}?`);
    setShowQuestion(true);
  };
  
  const handlePreview = (event) => {
    event.preventDefault();
    setShowPreview(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowQuestion(false);
    try {
      if (!selectedBranch) {
        throw new Error('Debe seleccionar una sucursal');
      }
  
      const employeeData = {
        branchName: selectedBranch.toLowerCase(), // Convertir a minúsculas
        name: form.name,
        ci: form.ci,
        phone: form.phone,
        email: form.email,
        password: form.password,
        contractStart: form.contractStart,
        contractEnd: form.contractEnd,
        salary: form.salary,
        role: form.role,
        photo: imageUrl || null
      };
  
      console.log('Datos a enviar:', employeeData);
  
      const response = await addEmployeeToBranchRequest(employeeData);
      console.log('Respuesta:', response.data);
  
      setForm({
        branchName: "",
        name: "",
        ci: "",
        phone: "",
        email: "",
        password: "",
        contractStart: "",
        contractEnd: "",
        salary: "",
        role: ""
      });
      setImageUrl("");
      setMessage(`Empleado registrado exitosamente en la sucursal ${selectedBranch}`);
      setShowAccept(true);
    } catch (error) {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error desconocido';
      setMessage(`Error al registrar empleado: ${errorMessage}`);
      setShowAccept(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-h-full overflow-auto">
      {!showPreview ? (
        <>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registrar Nuevo Empleado</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleConfirmEmployee} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-medium">Nombre <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={40}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          {/* CI */}
          <div>
            <label className="block text-gray-700 font-medium">CI <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="ci"
              value={form.ci}
              onChange={handleChange}
              maxLength={14}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 font-medium">Celular <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={8}
              title="Debe contener 8 números"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              maxLength={50}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                maxLength={16}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Sucursal */}
          <div className="relative" ref={branchesRef}>
            <label className="block text-gray-700 font-medium">Sucursal <span className="text-red-500">*</span></label>
            <button
              type="button"
              onClick={() => setShowBranches(!showBranches)}
              className="w-full p-2 border border-gray-300 rounded mt-1 flex items-center justify-between"
            >
              {selectedBranch || "Seleccionar Sucursal"}
              <FaChevronDown />
            </button>
            {showBranches && (
              <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-auto z-10">
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <div
                      key={branch._id}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleBranchSelect(branch.nameBranch)}
                    >
                      {branch.nameBranch}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2">No hay sucursales disponibles</div>
                )}
              </div>
            )}
          </div>

          {/* Fechas */}
          <div>
            <label className="block text-gray-700 font-medium">Fecha de Inicio <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="contractStart"
              value={form.contractStart}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Fecha de Fin <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="contractEnd"
              value={form.contractEnd}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          {/* Salario */}
          <div>
            <label className="block text-gray-700 font-medium">Salario <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              maxLength={5}
              min="1"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-gray-700 font-medium">Rol <span className="text-red-500">*</span></label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
              required
            >
              <option value="">Seleccionar Rol</option>
              <option value="Cajero">Cajero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Mesero">Mesero</option>
            </select>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-gray-700 font-medium">Foto</label>
            <CloudinaryUploadWidget onUpload={handleOnUpload} />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-1/2 bg-red-600 text-white p-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
            >
              Registrar Empleado
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="w-1/2 bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            >
              Ver Preview
            </button>
          </div>
        </form>
        </>
      ) : (
        <>
          <EmployeePreview form={form} />
          <button
            onClick={() => setShowPreview(false)}
            className="mt-4 w-full bg-gray-600 text-white p-2 rounded-md font-semibold hover:bg-gray-700 transition duration-300"
          >
            Volver al formulario
          </button>
        </>
      )}

      {/* Mensajes de confirmación y éxito/error */}
      {showQuestion && (
        <QuestionMessage
          message={message}
          onConfirm={handleSubmit}
          onCancel={() => setShowQuestion(false)}
        />
      )}
      {showAccept && (
        <AcceptMessage
          message={message}
          onAccept={() => setShowAccept(false)}
        />
      )}
    </div>
  );
};

export default EmployeeForm;