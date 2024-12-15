import { Link } from "react-router-dom";
import { FaBox, FaReceipt, FaUsers, FaMapMarkerAlt, FaBoxes } from "react-icons/fa";

const HomeAdmin = () => {

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido al Sistema de Administración de tu pollería
        </h1>
        <p className="text-gray-600 mt-2">
          Aquí puedes gestionar todos los aspectos de tu negocio de manera
          eficiente.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Links de administración sin condicionales de rol */}
        <Link
          to="/ventas/verVentas"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
        >
          <FaReceipt className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Ventas</h2>
            <p className="text-gray-600">
              Gestiona y revisa todas las ventas realizadas en el restaurante.
            </p>
          </div>
        </Link>
        <Link
          to="/productos/menu"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
        >
          <FaBox className="text-4xl text-green-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Productos
            </h2>
            <p className="text-gray-600">
              Administra el inventario y añade nuevos productos al menú.
            </p>
          </div>
        </Link>
        <Link
          to="/empleados/verEmpleados"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
        >
          <FaUsers className="text-4xl text-orange-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Empleados
            </h2>
            <p className="text-gray-600">
              Gestiona los datos y permisos de los empleados del restaurante.
            </p>
          </div>
        </Link>
        <Link
          to="/inventarios/verInventarios"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
        >
          <FaBoxes className="text-4xl text-gray-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Inventarios
            </h2>
            <p className="text-gray-600">
              Gestiona y controla el inventario de tu restaurante de manera
              eficiente.
            </p>
          </div>
        </Link>
        <Link
          to="/sucursales"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
        >
          <FaMapMarkerAlt className="text-4xl text-purple-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Sucursales
            </h2>
            <p className="text-gray-600">
              Administra las distintas sucursales y supervisa sus operaciones.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeAdmin;
