import { useEffect, useState } from "react";
import { addProductToBranchRequest } from "../../../api/branch.js";
import { useBranch } from "../../../CONTEXTS/BranchContext.tsx";
import QuestionMessage from "../../../GENERALCOMPONENTS/QuestionMessage.jsx";
import AcceptMessage from "../../../GENERALCOMPONENTS/AcceptMessage.tsx";
import CloudinaryUploadWidget from "../../../GENERALCOMPONENTS/CloudinaryUploadWidget.jsx";

const ProductForm = () => {
  const { selectedBranch } = useBranch();
  const [imageUrl, setImageUrl] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
  },[selectedBranch]);

  const [form, setForm] = useState({
    nameProduct: "",
    price: "",
    image: null,
    id: "",
    description: "",
  }); 
 
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleOnUpload = (error, result) => {
    if (error) {
      setMessage(error.message);
      setShowAccept(true);
      return;
    }
    
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
    }
  };

  const handleConfirmProduct = (event) => {
    event.preventDefault();
    // Muestra el mensaje de confirmación antes de enviar
    setMessage(`¿Estás seguro que deseas agregar el producto ${form.nameProduct} a la sucursal ${selectedBranch}?`);
    setShowQuestion(true);
  };

  const handleSubmit = async (event) => {
    setShowQuestion(false);
    event.preventDefault();
    try {
      const productData = {
        nameProduct: form.nameProduct,
        price: form.price,
        id: form.id,
        description: form.description,
        nameBranch: selectedBranch,
        image: imageUrl
      };

      const res = await addProductToBranchRequest(productData);
      console.log(res);

      setForm({ nameProduct: "", price: "", id: "", description: "" });
      setImageUrl("");
      setMessage(`Producto agregado exitosamente en la sucursal ${selectedBranch}. Vaya a la vista de productos para verlo.`);
      setShowAccept(true);
    } catch (error) {
      console.log(error.response.data.message);
      setMessage(`Error al agregar producto (Error:${error.response.data.message})`);
      setShowAccept(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Agregar Nuevo Producto</h2>
      <form onSubmit={handleConfirmProduct} className="space-y-4">

        <div>
          <label className="block text-gray-700 font-medium">Nombre del Producto <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="nameProduct"
            value={form.nameProduct}
            onChange={handleChange}
            maxLength={40}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Precio <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            maxLength={5}
            required
            min="0"
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">ID para el producto<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            maxLength={14}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Descripción <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            maxLength={100}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Subir imagen <span className="text-red-500">*</span></label>
          <CloudinaryUploadWidget onUpload={handleOnUpload} />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
        >
          Agregar Producto
        </button>
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
      </form>
    </div>
  );
};

export default ProductForm;
