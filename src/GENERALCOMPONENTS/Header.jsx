// src/GENERALCOMPONENTS/Header.jsx
import { FaBars, FaUser, FaChevronDown, FaShoppingCart } from 'react-icons/fa';
import { useContext, useState, useRef, useEffect } from 'react';
import NavBar from './NavBar';
import { useAuth } from '../GENERALCOMPONENTS/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useBranch } from '../CONTEXTS/BranchContext';
import { CartContext } from '../CONTEXTS/cartContext';

const Header = () => {
  useEffect(() => {
    const handleClickOutSideToBranchMenu = (event) => {
      if(branchMenuRef.current && !branchMenuRef.current.contains(event.target)){
        setShowBranches(false);
      }
    };

    const handleClickOutSideToUserMenu = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) && // Clic fuera del menú
        event.target.closest(".user-menu-button") === null // Clic fuera del botón
      ) {
        setShowUserMenu(false); // Cierra el menú
      }
    };
    
    document.addEventListener('mousedown', handleClickOutSideToBranchMenu);
    document.addEventListener('mousedown', handleClickOutSideToUserMenu);

    return () => {
      document.removeEventListener('mousedown', handleClickOutSideToBranchMenu);
      document.removeEventListener('mousedown', handleClickOutSideToUserMenu);
    }
  },[]);

  const [showNavBar, setShowNavBar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const branchMenuRef = useRef(null);
  const userMenuRef = useRef(null);


  const { user, logOut, isLoading } = useAuth();
  const { selectedBranch, setSelectedBranch, branches } = useBranch();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const toggleNavBar = () => {
    setShowNavBar(prevState => !prevState);
  };
  
  const toggleBranchesMenu = () => setShowBranches(!showBranches);
  const toggleUserMenu = () => {
    console.log(showUserMenu);
    setShowUserMenu(!showUserMenu);
  }

  const closeNavBar = () => setShowNavBar(false);

  const handleLogoutClick = async () => {
    try {
      setShowModal(false);
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch.nameBranch);
    setShowBranches(false);
  };

  const handleOptionUserMenuSelect = () => {
    setShowUserMenu(false);
  }

  const userRole = user ? user.role : null;

  if (isLoading) return <div>Cargando...</div>;

  return (
    <>
      {(userRole === "admin" ||
        userRole === "client" ||
        userRole === "worker") && (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-red-600 text-white shadow-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleNavBar}
              className="text-3xl hover:text-yellow-300 transition-colors"
            >
              <FaBars />
            </button>
            <Link
              to="/inicio"
              className="text-2xl font-semibold hover:text-yellow-300 transition-colors"
            >
              Sistema de Administración
            </Link>
            <div className="relative" ref={branchMenuRef}>
              <button
                onClick={toggleBranchesMenu}
                className="ml-2 md:ml-4 flex items-center space-x-1"
              >
                <span className="text-sm md:text-base">
                  {selectedBranch || "Seleccionar Sucursal"}
                </span>
                <FaChevronDown className="text-xl md:text-2xl hover:text-yellow-300 transition-colors" />
              </button>
              {showBranches && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  {branches.length > 0 ? (
                    <ul className="max-h-48 overflow-y-auto custom-scrollbar">
                      {branches.map((branch) => (
                        <li
                          key={branch._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleBranchSelect(branch)}
                        >
                          {branch.nameBranch}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No hay sucursales disponibles
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="relative flex items-center space-x-4">
            {userRole === "client" && (
              <Link
                to="/cart"
                className="relative text-white hover:text-yellow-300 transition-colors"
              >
                <FaShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleUserMenu}
              className="user-menu-button flex items-center space-x-2 bg-white text-red-600 py-1 px-3 mr-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg font-medium">{user.name}</span>
              <FaUser className="text-2xl" />
            </button>
            <div className="fixed top-14 right-1" ref={userMenuRef}>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-red-600 shadow-lg rounded-lg z-10">
                  <ul>
                    {/*{userRole === "admin" && (
                      <li
                        className="px-4 py-2 hover:bg-red-100 cursor-pointer rounded-t-lg"
                        onClick={handleOptionUserMenuSelect}
                      >
                        <Link to="/reports">Informes Financieros</Link>
                      </li>
                    )}*/}
                    <li
                      className="px-4 py-2 hover:bg-red-100 cursor-pointer rounded-t-lg"
                      onClick={handleOptionUserMenuSelect}
                    >
                      <Link to="/profile">Ver Usuario</Link>
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-red-100 cursor-pointer rounded-b-lg"
                      onClick={() => {
                        handleOptionUserMenuSelect();
                        setShowModal(true);
                      }}
                    >
                      Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Modal de confirmación de cerrar sesión */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que quieres cerrar sesión?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {showNavBar && <NavBar closeNavBar={closeNavBar} userRole={userRole} />}
    </>
  );
};

export default Header;
