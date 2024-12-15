import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { useBranch } from "../../../CONTEXTS/BranchContext";

const EmployeeForm = ({ onFormChange }) => {
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
    photo: null,
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const branchesRef = useRef(null);
  const { branches, selectedBranch, setSelectedBranch } = useBranch();

  const validateForm = () => {
    // Validación básica de campos requeridos
    if (!form.name || !form.ci || !form.phone || !form.email || !form.password || 
        !form.contractStart || !form.contractEnd || !form.salary || !form.role) {
      setError("Por favor complete todos los campos requeridos");
      return false;
    }

    // Validaciones básicas de formato
    if (!/^\d+$/.test(form.phone)) {
      setError("El teléfono solo debe contener números");
      return false;
    }

    if (!/^\d+$/.test(form.ci)) {
      setError("El CI solo debe contener números");
      return false;
    }

    if (form.salary <= 0) {
      setError("El salario debe ser mayor a 0");
      return false;
    }

    setError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Validaciones básicas durante el ingreso
    if (name === "phone") {
      // Solo permite números y máximo 8 dígitos
      if (!/^\d*$/.test(value)) return;
      if (value.length > 8) return;
    }
    if (name === "ci" && !/^\d*$/.test(value)) return;
    if (name === "salary" && value < 0) return;

    setForm(prevForm => ({
      ...prevForm,
      [name]: type === "file" ? files[0] : value
    }));

    onFormChange({
      ...form,
      [name]: type === "file" ? files[0] : value
    });

    setError(""); // Limpiar error al modificar cualquier campo
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (branchesRef.current && !branchesRef.current.contains(event.target)) {
        setShowBranches(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
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
      role: "",
      photo: null,
    });
    setError("");
    onFormChange({});
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registrar Nuevo Empleado</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                    onClick={() => {
                      setSelectedBranch(branch.nameBranch);
                      setForm({ ...form, branchName: branch.nameBranch });
                      setShowBranches(false);
                    }}
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
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition duration-300"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;