import { useState, useEffect } from "react";
import { useBranch } from "../../../CONTEXTS/BranchContext.tsx";
import {
  getProductsByBranchRequest,
  addSaleToBranchRequest,
} from "../../../api/branch.js";
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage.jsx";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage.tsx";

const SaleForm = () => {
  const { selectedBranch } = useBranch();
  const [ showQuestion, setShowQuestion ] = useState(false);
  const [showAcceptMessage, setShowAcceptMessage] = useState(false);
  const [acceptMessageText, setAcceptMessageText] = useState("");

  const handleConfirmSale = () => {
    setShowQuestion(true); 
  };

  const handleCancel = () => {
    setShowQuestion(false);
  };

  const [form, setForm] = useState({
    clientName: "",
    clientCI: "",
    discount: 0,
    saleDate: new Date().toISOString(),
  });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        await console.log(selectedBranch);
        const res = await getProductsByBranchRequest(selectedBranch);
        await console.log("res", res.data.products);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [selectedBranch]);

  useEffect(() => {
    const today = new Date();
    const isThursday = today.getDay() === 4;

    if (isThursday) {
      setForm((prev) => ({
        ...prev,
        discount: 4,
      }));
      setDiscountMessage(
        "¡Hoy es jueves! Tienes un descuento del 4% en tu compra."
      );
    } else {
      setDiscountMessage("");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowQuestion(false); 
    
    try {
      const productsData = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const saleData = {
        nameBranch: selectedBranch,
        clientName: form.clientName,
        clientCI: form.clientCI,
        discount: form.discount,
        saleDate: form.saleDate,
        products: productsData,
        total: calculateCartTotal(),
      };

      const res = await addSaleToBranchRequest(saleData);
      console.log("Venta registrada:", res);

      setForm({
        clientName: "",
        clientCI: "",
        discount: 0,
        saleDate: new Date().toISOString(),
      });
      setCart([]);
      setAcceptMessageText("Venta registrada exitosamente, vaya a la vista de ver ventas para verla");
      setShowAcceptMessage(true);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      setAcceptMessageText("Ocurrió un error al registrar la venta, por favor intente nuevamente.");
      setShowAcceptMessage(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleQuantityChange = (index, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = parseInt(newQuantity);
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.nameProduct === product.nameProduct);
      if (existingItem) {
        return prevCart.map((item) =>
          item.nameProduct === product.nameProduct
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const calculateCartTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discountAmount = (form.discount / 100) * subtotal;
    return (subtotal - discountAmount).toFixed(2);
  };

  const filterProducts = (products, searchTerm) => {
    const isNumber = !isNaN(parseFloat(searchTerm)) && isFinite(searchTerm);

    return products.filter((product) => {
      if (isNumber) {
        const priceStr = product.price.toString();
        return priceStr.includes(searchTerm);
      } else {
        return product.nameProduct
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Formulario de Venta */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Formulario de Venta
          </h2>

          <form className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Cliente
              </label>
              <input
                type="text"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                maxLength={15}
                 
                required
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CI del Cliente
              </label>
              <input
                type="number"
                name="clientCI"
                value={form.clientCI}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Buscar Producto
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o precio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Producto
              </label>
              <div className="flex flex-wrap gap-2 py-2">
                {filterProducts(products, searchTerm).map((product) => (
                  <div
                    key={product._id}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer text-sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    <p>{product.nameProduct}</p>
                    <p>{product.price.toFixed(2)} Bs.</p>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Carrito */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Carrito</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nameProduct}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.price.toFixed(2)} Bs.
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="border rounded-md p-1 w-16"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total:</p>
            <p className="text-lg font-semibold">{calculateCartTotal()} Bs.</p>
          </div>
        </div>

        {/* Factura */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Factura</h2>
          <div className="space-y-2">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between items-center gap-2 text-sm"
              >
                <p className="font-medium">{item.name}</p>
                <p>
                  {item.quantity} x {item.price.toFixed(2)} Bs.
                </p>
                <p className="font-semibold">
                  {(item.quantity * item.price).toFixed(2)} Bs.
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4" />
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-base">Subtotal:</p>
              <p className="text-base">
                {cart
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}{" "}
                Bs.
              </p>
            </div>
            {form.discount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <p className="text-base">Descuento ({form.discount}%):</p>
                <p className="text-base">
                  -
                  {(
                    (form.discount / 100) *
                    cart.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                  ).toFixed(2)}{" "}
                  Bs.
                </p>
              </div>
            )}
          </div>

          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total:</p>
            <p className="text-lg font-semibold">{calculateCartTotal()} Bs.</p>
          </div>
          <button
            onClick={handleConfirmSale}
            disabled={
              !form.clientName.trim() ||
              !form.clientCI.trim() ||
              cart.length === 0
            }
            className={`mt-4 px-4 py-2 rounded-md w-full transition duration-300 ${
              !form.clientName.trim() ||
              !form.clientCI.trim() ||
              cart.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Confirmar Venta
          </button>
          {showQuestion && (
            <QuestionMessage
              message="¿Estás seguro de que quieres confirmar esta venta?"
              onConfirm={handleSubmit}
              onCancel={handleCancel}
            />
          )}
          {showAcceptMessage && (
            <AcceptMessage
              message={acceptMessageText}
              onAccept={() => setShowAcceptMessage(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleForm;