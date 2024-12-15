import { useState, useEffect } from "react";
import { useBranch } from "../../../CONTEXTS/BranchContext.tsx";
import { 
  addInventoryToBranchRequest,
  getEmployeesByBranchRequest
} from "../../../api/branch.js";
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage.jsx";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage.tsx";

const AutomatedInventoryForm = () => {
  const { selectedBranch } = useBranch();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [observations, setObservations] = useState("");
  
  // Estados para mensajes
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedBranch) {
      loadEmployees();
    }
  }, [selectedBranch]);

  const loadEmployees = async () => {
    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    if (!branchName) return;

    setIsLoading(true);
    try {
      const response = await getEmployeesByBranchRequest(branchName);
      if (response.data?.employees) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      setMessage("Error al cargar los empleados. Por favor, intente nuevamente.");
      setShowAccept(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeSelection = (employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.some(e => e.employeeCi === employee._id);
      
      if (isSelected) {
        return prev.filter(e => e.employeeCi !== employee._id);
      } else {
        return [...prev, {
          employeeCi: employee._id,
          name: employee.name
        }];
      }
    });
  };

  const handleStartInventory = () => {
    if (selectedEmployees.length === 0) {
      setMessage("Por favor, seleccione al menos un empleado");
      setShowAccept(true);
      return;
    }

    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    if (!branchName) {
      setMessage("Error con el nombre de la sucursal");
      setShowAccept(true);
      return;
    }

    setMessage(`¿Está seguro que desea iniciar el inventario para la sucursal ${branchName}?`);
    setShowQuestion(true);
  };

  const handleConfirmInventory = async () => {
    setShowQuestion(false);
    const branchName = typeof selectedBranch === 'string' 
      ? selectedBranch 
      : selectedBranch.nameBranch;

    try {
      setIsLoading(true);
      
      const inventoryData = {
        nameBranch: branchName,
        employees: selectedEmployees,
        observations: observations || "Inventario inicial del día"
      };

      const response = await addInventoryToBranchRequest(inventoryData);
      
      if (response.data && response.data.success) {
        setMessage("Inventario iniciado exitosamente");
        setShowAccept(true);
        setSelectedEmployees([]);
        setObservations("");
      } else {
        throw new Error(response.data?.message || "Error al iniciar el inventario");
      }
    } catch (error) {
      console.error("Error al iniciar inventario:", error);
      setMessage(error.response?.data?.message || "Error al iniciar el inventario");
      setShowAccept(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Iniciar Inventario - {typeof selectedBranch === 'string' ? selectedBranch : selectedBranch?.nameBranch}
        </h2>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Seleccionar Empleados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {employees.map((employee) => (
                  <div
                    key={employee._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedEmployees.some(e => e.employeeCi === employee._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => handleEmployeeSelection(employee)}
                  >
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm">{employee.ci}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Observaciones
              </h3>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                maxLength={200}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="Observaciones opcionales para el inventario"
              />
            </div>

            <button
              onClick={handleStartInventory}
              disabled={isLoading || selectedEmployees.length === 0}
              className={`w-full py-2 px-4 rounded-md text-white transition-colors duration-200 
                ${isLoading || selectedEmployees.length === 0
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              Iniciar Inventario del Día
            </button>
          </div>
        )}
      </div>

      {showQuestion && (
        <QuestionMessage
          message={message}
          onConfirm={handleConfirmInventory}
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

export default AutomatedInventoryForm;