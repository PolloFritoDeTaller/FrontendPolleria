// src/components/ViewProducts.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranch } from '../../CONTEXTS/BranchContext';
import { FaBook, FaEdit, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { CartContext } from '../../CONTEXTS/cartContext';
import { getProductsByBranchRequest, editProductRequest, deleteProductRequest } from "../../api/branch"; // Keep a single import line
import QuestionMessage from "../../GENERALCOMPONENTS/QuestionMessage";
import AcceptMessage from "../../GENERALCOMPONENTS/AcceptMessage";
import { useAuth } from '../../GENERALCOMPONENTS/AuthContext';
import { API } from '../../api/conf/routeApi';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);
  const { selectedBranch } = useBranch();
  const { user } = useAuth();
  const userRole = user ? user.role : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByBranchRequest(selectedBranch);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProducts();
  }, [selectedBranch]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };

  const handleEditClick = (event, product) => {
    event.stopPropagation();
    setIsEditing(true);
    setEditProduct({ ...product });
  };

  const handleEditSave = async () => {
    try {
      // Crear un FormData para enviar la información, incluyendo la imagen si existe
      const formData = new FormData();
      formData.append("id", editProduct.id);
      formData.append("nameProduct", editProduct.nameProduct);
      formData.append("price", editProduct.price);
      formData.append("description", editProduct.description);

      // Solo agregar la imagen si es un nuevo archivo
      if (editProduct.image instanceof File) {
        formData.append("image", editProduct.image);
      }

      // Enviar los datos al servidor
      const response = await editProductRequest(editProduct._id, formData);

      // Actualizar el estado de productos para reflejar los cambios en la interfaz
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editProduct._id ? response.data.product : product
        )
      );

      // Resetear el estado de edición
      setIsEditing(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error al guardar la edición del producto:", error);
      setErrorMessage("Error al guardar los cambios del producto. Intente de nuevo más tarde.");

      setErrorMessage("Error al guardar los cambios. Intenta nuevamente.");
    }
  };

  const requestDeleteProduct = (event, product) => {
    event.stopPropagation();
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProductRequest(productToDelete._id)
        .then(() => {
          setProducts(products.filter((product) => product._id !== productToDelete._id));
          setProductToDelete(null);
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          setErrorMessage("Error eliminando el producto. Intente de nuevo más tarde.");
        });
    }
  };

  const handleCancelDelete = () => setProductToDelete(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Productos
      </h1>
      <input
        type="text"
        placeholder="Buscar productos por nombre o precio..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex flex-col border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            {product.image && (
              <img
                src={`${API}/uploads/${product.image}`}
                alt={product.nameProduct}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {product.nameProduct}
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>ID:</strong> {product.id}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Precio:</strong> {product.price} BS
              </p>
              <p className="text-gray-600">
                <strong>Descripción:</strong> {product.description}
              </p>
            </div>
            <div className="flex justify-center p-4 gap-8">
              {userRole === "client" && (
                <button
                  title="Añadir al Carrito"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="text-green-500 hover:text-green-700"
                >
                  <FaShoppingCart size={20} />
                </button>
              )}
              {userRole === "admin" && (
                <>
                  <button
                    title="Editar producto"
                    onClick={(event) => handleEditClick(event, product)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    title="Eliminar producto"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDeleteProduct(e, product);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </>
              )}
              {(userRole === "admin" || userRole === "worker") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/productos/editar-receta", {
                      state: { product },
                    });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaBook size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {productToDelete && (
        <QuestionMessage
          message={`¿Estás seguro que deseas borrar este producto de la sucursal ${selectedBranch}? Recuerda que esta acción es irreversible.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {errorMessage && (
        <AcceptMessage
          message={errorMessage}
          onAccept={() => setErrorMessage("")}
        />
      )}

      {isEditing && editProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>

            {/* Campo para editar el nombre */}
            <label className="block mb-2">Nombre:</label>
            <input
              type="text"
              name="nameProduct"
              value={editProduct.nameProduct}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Campo para editar la imagen */}
            <label className="block mb-2">Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditProduct({ ...editProduct, image: e.target.files[0] })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Campo para editar el ID */}
            <label className="block mb-2">ID:</label>
            <input
              type="text"
              name="id"
              value={editProduct.id}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Campo para editar el precio */}
            <label className="block mb-2">Precio:</label>
            <input
              type="number"
              name="price"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Campo para editar la descripción */}
            <label className="block mb-2">Descripción:</label>
            <textarea
              name="description"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  [e.target.name]: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Botones para guardar o cancelar */}
            <div className="flex justify-end">
              <button
                onClick={handleEditSave} // Llama a la función para guardar los cambios
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
