import { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { FaShoppingCart } from 'react-icons/fa';
import { useBranch } from '../../CONTEXTS/BranchContext';
import { getProductsByBranchRequest } from '../../api/branch';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { API } from '../../api/conf/routeApi';

const HomeClient = () => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const { selectedBranch } = useBranch();
  console.log(selectedBranch);

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

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${API}/promotions`); 
        setPromotions(response.data);
      } catch (error) {
        console.error('Error al obtener las promociones:', error);
      }
    };
    fetchPromotions();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true
  };

  return (
    <div className="bg-gray-100 font-sans">
      {/* Carrusel de productos */}
      <section className="my-10">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Productos Destacados
        </h2>
        <Slider {...settings} className="w-1/2 mx-auto">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative rounded-xl overflow-hidden"
            >
              <img
                src={`${API}/uploads/${product.image}`}
                alt={product.nameProduct}
                className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
                <h3 className="text-xl font-semibold">{product.nameProduct}</h3>
                <p className="text-lg">{product.price} BS</p>
                <Link to="/productos/menu">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-full mt-2 hover:bg-green-700 transition-all">
                    <FaShoppingCart className="mr-2" /> Añadir al Carrito
                    </button>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Sección de promociones */}
      <section className="bg-green-600 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Promociones Especiales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promotion) => (
              <div
                key={promotion._id}
                className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={`${API}/uploads/${promotion.image}`}
                  alt={promotion.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {promotion.title}
                </h3>
                <p>{promotion.description}</p>
                <p className="mt-4 text-lg font-bold">
                  {promotion.discount}% de descuento
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de productos recomendados */}
      <section className="py-12">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Productos Recomendados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 container mx-auto">
          {products.slice(0, 4).map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={`${API}/uploads/${product.image}`}
                alt={product.nameProduct}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-xl">{product.nameProduct}</h3>
                <p className="text-lg text-green-600">{product.price} BS</p>
                <Link to="/productos/menu">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-full mt-2 hover:bg-green-700 transition-all">
                    <FaShoppingCart className="mr-2" /> Añadir al Carrito
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeClient;
