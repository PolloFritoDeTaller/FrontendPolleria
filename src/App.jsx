import { Routes, Route, BrowserRouter, useLocation, Navigate } from "react-router-dom";
import Header from "./GENERALCOMPONENTS/Header";
import RegisterProduct from "./PAGES/RegisterProduct/RegisterProduct";
import ViewProducts from './PAGES/ViewProducts/ViewProducts';
import RegisterSale from "./PAGES/RegisterSale/RegisterSale";
import RegisterEmployee from './PAGES/RegisterEmployee/RegisterEmployee';
import ViewEmployees from './PAGES/ViewEmployees/components/ViewEmployees';
import ViewSales from './PAGES/ViewSales/ViewSales';
import RegisterInventory from './PAGES/RegisterInventory/RegisterInventory';
import ViewInventory from './PAGES/ViewInventory/ViewInventory';
import InventoryDetails from './PAGES/InventoryDetails/InventoryDetails';
import RegisterIngredient from "./PAGES/RegisterIngredient/RegisterIngredient";
import ViewIngredients from './PAGES/ViewIngredients/ViewIngredients';
import EditRecipeProduct from './PAGES/EditRecipeProduct/EditRecipeProduct';
import { BranchProvider } from "./CONTEXTS/BranchContext";
import Login from "./PAGES/Login";
import { AuthProvider, useAuth } from "./GENERALCOMPONENTS/AuthContext"; // Asegúrate de importar useAuth
import BranchesPage from "./PAGES/Branches/BranchesPage";
import Home from "./PAGES/HomePage/Home";
import ProductDetails from "./PAGES/ProductDetail/productDetail";
import Cart from "./PAGES/cart/cart";
import { CartProvider } from "./CONTEXTS/cartContext";
import UserProfile from "./PAGES/UserProfile";
import Report from "./PAGES/Report/Report";
import PrivateRoute from "./GENERALCOMPONENTS/PrivateRoute";
import Index from "./PAGES/Index/Index";
import Register from "./PAGES/RegisterUser/RegisterUser";
import ViewBranchPage from "./PAGES/ViewBranch/ViewBranchPage";
import CardDetailsPage from "./GENERALCOMPONENTS/CardDetailsForm";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CartProvider>
        <AuthProvider>
          <BranchProvider>
            <Main />
          </BranchProvider>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  const noMarginRoutes = ['/login', '/registro', '/pago/tarjeta', '/'];

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/pago/tarjeta' && location.pathname !== '/' && location.pathname !== '/index' && <Header />}
      <div className={noMarginRoutes.includes(location.pathname) ? "" : "mt-16"}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Navigate to="/" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/pago/tarjeta" element={<PrivateRoute allowedRoles={["admin", "worker"]}><CardDetailsPage /></PrivateRoute>} />

          <Route path="/inicio" element={<PrivateRoute allowedRoles={["admin", "worker", "client"]}><Home /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={["admin", "worker", "client"]}><UserProfile /></PrivateRoute>} />
          <Route path="/productos/registrarProducto" element={<PrivateRoute allowedRoles={["admin"]}><RegisterProduct /></PrivateRoute>} />
          <Route path="/productos/menu" element={<PrivateRoute allowedRoles={["admin", "worker", "client"]}><ViewProducts /></PrivateRoute>} />
          <Route path="/productos/editar-receta" element={<PrivateRoute allowedRoles={["admin", "worker"]}><EditRecipeProduct /></PrivateRoute>} />
          <Route path="/ventas/nuevaVenta" element={<PrivateRoute allowedRoles={["admin", "worker"]}><RegisterSale /></PrivateRoute>} />
          <Route path="/ventas/verVentas" element={<PrivateRoute allowedRoles={["admin", "worker"]}><ViewSales /></PrivateRoute>} />
          <Route path="/empleados/registrarEmpleado" element={<PrivateRoute allowedRoles={["admin"]}><RegisterEmployee /></PrivateRoute>} />
          <Route path="/empleados/verEmpleados" element={<PrivateRoute allowedRoles={["admin"]}><ViewEmployees /></PrivateRoute>} />
          <Route path="/sucursales" element={<PrivateRoute allowedRoles={["admin"]}><BranchesPage /></PrivateRoute>} />
          <Route path="/sucursal/:id" element={<PrivateRoute allowedRoles={["admin"]}><ViewBranchPage /></PrivateRoute>} />
          <Route path="/inventarios/registrarInventario" element={<PrivateRoute allowedRoles={["admin"]}><RegisterInventory /></PrivateRoute>} />
          <Route path="/inventarios/verInventarios" element={<PrivateRoute allowedRoles={["admin", "worker"]}><ViewInventory /></PrivateRoute>} />
          <Route path="/inventario/detalles/:id" element={<PrivateRoute allowedRoles={["admin", "worker"]}><InventoryDetails /></PrivateRoute>} />
          <Route path="/insumos/registrar" element={<PrivateRoute allowedRoles={["admin"]}><RegisterIngredient /></PrivateRoute>} />
          <Route path="/insumos/ver" element={<PrivateRoute allowedRoles={["admin"]}><ViewIngredients /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute allowedRoles={["admin", "worker", "client"]}><ProductDetails /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute allowedRoles={["client"]}><Cart /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute allowedRoles={["admin"]}><Report /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
