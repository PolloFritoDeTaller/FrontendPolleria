// src/PAGES/Index.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsByBranchRequest } from "../../api/branch";
import PublicHeader from "../../GENERALCOMPONENTS/PublicHeader";
import { useBranch } from '../../CONTEXTS/BranchContext';

const Index = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { selectedBranch } = useBranch();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!selectedBranch) return;

            try {
                const response = await getProductsByBranchRequest(selectedBranch);
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        fetchProducts();
    }, [selectedBranch]);

    // Uso de useMemo para optimizar el filtrado
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toString().includes(searchTerm)
        );
    }, [products, searchTerm]);

    return (
        <div style={{ minHeight: "100vh" }} className="flex flex-col">
            <PublicHeader />

            {/* Imagen de encabezado */}
            <div className="relative w-full h-48 md:h-64 lg:h-80 bg-cover bg-center"
                style={{ backgroundImage: "url('/pollo.jpg')" }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <h1 className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    Pollos Fritos
                </h1>
            </div>

            <div className="container mx-auto p-4 flex-grow">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">Nuestros Productos</h2>
                <input
                    type="text"
                    placeholder="Buscar productos por nombre o precio..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full p-2 md:p-3 mb-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => navigate(`/login`)}
                            className="flex flex-col border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            {product.image && (
                                <img
                                    src={`http://localhost:3000/uploads/${product.image}`}
                                    alt={product.nameProduct}
                                    className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-t-lg"
                                    loading="lazy"  // Optimización de carga de imágenes
                                />
                            )}
                            <div className="p-3 md:p-4">
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">{product.nameProduct}</h2>
                                <p className="text-gray-600 text-sm md:text-base mb-1"><strong>Precio:</strong> {product.price} BS</p>
                                <p className="text-gray-600 text-sm md:text-base"><strong>Descripción:</strong> {product.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="bg-red-600 text-white text-center p-4 mt-10">
                <p>&copy; {new Date().getFullYear()} Pollos Fritos - Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Index;
