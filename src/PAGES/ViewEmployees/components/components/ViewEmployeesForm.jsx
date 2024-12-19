import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranch } from '../../../../CONTEXTS/BranchContext';
import { getEmployeesWithFiltersRequest, editEmployeeRequest, deleteEmployeeRequest } from '../../../../api/branch';
import QuestionMessage from "../../../../GENERALCOMPONENTS/QuestionMessage";
import AcceptMessage from "../../../../GENERALCOMPONENTS/AcceptMessage";
import CloudinaryUploadWidget from "../../../../GENERALCOMPONENTS/CloudinaryUploadWidget";

const ViewEmployeesForm = ({ activeFilters }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  
  // Estados para mensajes
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { selectedBranch } = useBranch();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (!selectedBranch) return;

        const response = await getEmployeesByBranchRequest(selectedBranch);
        let employeesData = response.data.employees;

        // Aplicar filtros localmente si existen
        if (activeFilters) {
          if (activeFilters.salaryRange?.min || activeFilters.salaryRange?.max) {
            employeesData = employeesData.filter(employee => {
              const salary = Number(employee.salary);
              const min = Number(activeFilters.salaryRange.min) || 0;
              const max = Number(activeFilters.salaryRange.max) || Infinity;
              return salary >= min && salary <= max;
            });
          }

          if (activeFilters.role && activeFilters.role !== 'all') {
            employeesData = employeesData.filter(employee => 
              employee.role.toLowerCase() === activeFilters.role.toLowerCase()
            );
          }

          if (activeFilters.contractStatus && activeFilters.contractStatus !== 'all') {
            const today = new Date();
            employeesData = employeesData.filter(employee => {
              const endDate = new Date(employee.contractEnd);
              return activeFilters.contractStatus === 'active' 
                ? endDate >= today 
                : endDate < today;
            });
          }
        }

        setEmployees(employeesData);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
        setErrorMessage("Error al cargar los empleados: " + 
          (error.response?.data?.message || error.message));
        setShowErrorMessage(true);
      }
    };

    fetchEmployees();
  }, [selectedBranch, activeFilters]);

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setIsEditing(true);
  };

  const handleImageUpload = (error, result) => {
    if (error) {
      setErrorMessage("Error al subir la imagen");
      setShowErrorMessage(true);
      return;
    }
    
    if (result.event === "success") {
      setEditEmployee({ 
        ...editEmployee, 
        photo: result.info.secure_url 
      });
    }
  };

  const validateEditForm = () => {
    if (!editEmployee.name?.trim()) {
      setErrorMessage("El nombre es requerido");
      setShowErrorMessage(true);
      return false;
    }
    
    const salary = Number(editEmployee.salary);
    if (!salary || salary <= 0) {
      setErrorMessage("El salario debe ser mayor a 0");
      setShowErrorMessage(true);
      return false;
    }

    if (!editEmployee.email?.trim()) {
      setErrorMessage("El email es requerido");
      setShowErrorMessage(true);
      return false;
    }

    if (!editEmployee.role?.trim()) {
      setErrorMessage("El rol es requerido");
      setShowErrorMessage(true);
      return false;
    }

    return true;
  };

  const handleEditSave = async () => {
    if (!validateEditForm()) return;

    try {
      const response = await editEmployeeRequest(editEmployee._id, {
        name: editEmployee.name,
        salary: Number(editEmployee.salary),
        email: editEmployee.email,
        role: editEmployee.role,
        photo: editEmployee.photo // Ahora enviamos la URL de Cloudinary
      });
      
      setEmployees(employees.map(emp => 
        emp._id === editEmployee._id ? response.data.employee : emp
      ));
      setIsEditing(false);
      setEditEmployee(null);
      setSuccessMessage("Empleado actualizado exitosamente");
      setShowSuccessMessage(true);
    } catch (error) {
      setErrorMessage("Error al actualizar el empleado");
      setShowErrorMessage(true);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployeeRequest(employeeToDelete._id);
      setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));
      setShowDeleteConfirmation(false);
      setSuccessMessage("Empleado eliminado exitosamente");
      setShowSuccessMessage(true);
    } catch (error) {
      setErrorMessage("Error al eliminar el empleado");
      setShowErrorMessage(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEmployeeToDelete(null);
  };

  const filteredEmployees = employees.filter(employee => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      employee.ci.toLowerCase().includes(lowerCaseSearchTerm) ||
      employee.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Carnets de Empleados
      </h1>
      <input
        type="text"
        placeholder="Buscar empleados por nombre, CI o email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {/* Modal de edición */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Editar Empleado</h2>
            
            <input
              type="text"
              placeholder="Nombre"
              value={editEmployee.name}
              onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Salario"
              value={editEmployee.salary}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || Number(value) > 0) {
                  setEditEmployee({ ...editEmployee, salary: value });
                }
              }}
              min="1"
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Correo"
              value={editEmployee.email}
              onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <select
              value={editEmployee.role}
              onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })}
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            >
              <option value="">Seleccionar Rol</option>
              <option value="Cajero">Cajero</option>
              <option value="Cocinero">Cocinero</option>
              <option value="Mesero">Mesero</option>
            </select>
            
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee._id} className="flex flex-col border rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 flex flex-col items-center">
              <div className="w-24 h-24 mb-4">
                {employee.photo ? (
                  <img
                    src={employee.photo} // Usamos directamente la URL de Cloudinary
                    alt={employee.name}
                    className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    Sin foto
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">{employee.name}</h2>
              <p className="text-gray-600"><strong>CI:</strong> {employee.ci}</p>
              <p className="text-gray-600"><strong>Correo:</strong> {employee.email}</p>
              <p className="text-gray-600"><strong>Rol:</strong> {employee.role}</p>
              <p className="text-gray-600"><strong>Salario:</strong> {employee.salary} BS</p>
            </div>
            <div className="flex justify-between p-4">
              <button
                onClick={() => handleEdit(employee)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteClick(employee)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensajes de confirmación y respuesta */}
      {showDeleteConfirmation && (
        <QuestionMessage
          message={`¿Estás seguro de que deseas eliminar al empleado ${employeeToDelete?.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {showSuccessMessage && (
        <AcceptMessage
          message={successMessage}
          onAccept={() => setShowSuccessMessage(false)}
        />
      )}

      {showErrorMessage && (
        <AcceptMessage
          message={errorMessage}
          onAccept={() => setShowErrorMessage(false)}
        />
      )}
    </div>
  );
};

export default ViewEmployeesForm;