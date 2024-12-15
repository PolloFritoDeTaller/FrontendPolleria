import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBranch } from '../../CONTEXTS/BranchContext';
import { deleteProductRequest, getProductsByBranchRequest, editProductRequest } from '../../api/branch';
import { CartContext } from '../../CONTEXTS/cartContext';
import { FaEdit, FaTrash, FaShoppingCart, FaBook } from 'react-icons/fa';
import QuestionMessage from "../../GENERALCOMPONENTS/QuestionMessage";
import { useAuth } from '../../GENERALCOMPONENTS/AuthContext'; // Asumimos que existe este contexto
import { API } from '../../api/conf/routeApi';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const { selectedBranch } = useBranch();
  const { updateCartCount } = useContext(CartContext);
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación
  const userRole = user ? user.role : null; // Obtener el rol del usuario

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductsByBranchRequest(selectedBranch);
        const productData = response.data.products.find((p) => p._id === id);
        setProduct(productData);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };
    fetchProduct();
  }, [id, selectedBranch]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Llama a la función para actualizar el contador
  };

  const handleEditRecipe = (e, product) => {
    e.stopPropagation(); // Evitar que el click se propague al contenedor
    navigate('/productos/editar-receta', { state: { product } });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditProduct({ ...product });
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    formData.append("id", editProduct.id);
    formData.append("nameProduct", editProduct.nameProduct);
    formData.append("price", editProduct.price);
    formData.append("description", editProduct.description);

    if (editProduct.image instanceof File) {
      formData.append("image", editProduct.image);
    }

    try {
      const response = await editProductRequest(editProduct._id, formData);
      setProduct(response.data.product);
      setIsEditing(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error al guardar la edición del producto:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProductRequest(id);
      navigate('/productos/menu'); // Redirigir a la lista de productos después de borrar
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const requestDeleteConfirmation = () => {
    setShowDeleteConfirmation(true); // Mostrar mensaje de confirmación antes de eliminar
  };

  const handleConfirmDelete = () => {
    handleDelete(); // Llamar a la función de eliminación real
    setShowDeleteConfirmation(false); // Ocultar mensaje de confirmación
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false); // Cancelar eliminación y ocultar el mensaje de confirmación
  };

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg max-w-lg">
      {product.image && (
        <div className="mb-6">
          <img
            src={`${API}/uploads/${product.image}`}
            alt={product.nameProduct}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
      <h1 className="text-4xl font-semibold text-gray-900 mb-2">
        {product.nameProduct}
      </h1>
      <p className="text-2xl font-medium text-green-600 mb-4">
        Precio: {product.price} BS
      </p>
      <p className="text-gray-700 mb-6 leading-relaxed">
        {product.description}
      </p>

      {userRole === "client" && (
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition duration-200 mb-4"
        >
          <FaShoppingCart className="inline mr-2" /> Añadir al Carrito
        </button>
      )}

      {(userRole === "admin" || userRole === "worker") && (
        <>
          <button
            onClick={(e) => handleEditRecipe(e, product)}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition duration-200 mb-4"
          >
            <FaBook className="inline mr-2" /> Editar Receta
          </button>

          {userRole === "admin" && (
            <div className="flex space-x-4">
              <button
                onClick={handleEditClick}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-200 flex items-center justify-center"
              >
                <FaEdit className="mr-2" /> Editar
              </button>
              <button
                onClick={requestDeleteConfirmation} // Solicita confirmación de eliminación
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition duration-200 flex items-center justify-center"
              >
                <FaTrash className="mr-2" /> Eliminar
              </button>
            </div>
          )}
        </>
      )}

      {showDeleteConfirmation && (
        <QuestionMessage
          message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {isEditing && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>

            <label className="block mb-2">Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditProduct({ ...editProduct, image: e.target.files[0] })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <label className="block mb-2">ID:</label>
            <input
              type="text"
              name="id"
              value={editProduct.id}
              onChange={(e) =>
                setEditProduct({ ...editProduct, id: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <label className="block mb-2">Nombre:</label>
            <input
              type="text"
              name="nameProduct"
              value={editProduct.nameProduct}
              onChange={(e) =>
                setEditProduct({ ...editProduct, nameProduct: e.target.value })
              }
              maxLength={30}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <label className="block mb-2">Precio:</label>
            <input
              type="number"
              name="price"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              maxLength={5}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <label className="block mb-2">Descripción:</label>
            <textarea
              name="description"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
              maxLength={100}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <button
              onClick={handleEditSave}
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
      )}
    </div>
  );
};

export default ProductDetails;
