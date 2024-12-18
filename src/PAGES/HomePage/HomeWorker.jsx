import { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaBullhorn } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useBranch } from "../../CONTEXTS/BranchContext";
import {
  getBranchImagesRequest,
  getBranchTextsRequest,
} from "../../api/branch";

const HomeWorker = () => {
  const [branchMessages, setBranchMessages] = useState([]);
  const [branchImages, setBranchImages] = useState([]);
  const { selectedBranch, branches } = useBranch();

  const fetchBranchData = async (branchId) => {
    try {
      if (branchId) {
        // Fetch mensajes de la sucursal
        const messageResponse = await getBranchTextsRequest(branchId);
        console.log(messageResponse);

        setBranchMessages(messageResponse.texts || []);

        const imageResponse = await getBranchImagesRequest(branchId);
        setBranchImages(imageResponse.images || []);
      } else {
        setBranchMessages([]);
        setBranchImages([]);
      }
    } catch (error) {
      console.error("Error al obtener los datos de la sucursal:", error);
    }
  };

  useEffect(() => {
    const branchId = selectedBranch
      ? branches.find((branch) => branch.nameBranch === selectedBranch)?._id
      : null;

    fetchBranchData(branchId);
  }, [selectedBranch, branches]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const motivationalSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false
  };

  const messagesSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  return (
    <>
      <div className="bg-gray-50 font-sans flex flex-col sm:flex-row" style={{ minHeight: "81vh" }}>
        {/* Carrusel de Imágenes de la Sucursal */}
        <section className="my-10 sm:w-1/2 w-full mx-auto">
          <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
            Comunicados
          </h2>
          <Slider {...motivationalSliderSettings} className="w-full">
            {branchImages.map((image, index) => (
              <div
                key={index}
                className="relative transform transition-all hover:scale-105"
              >
                <img
                  src={`http://localhost:3000/${image.url}`}
                  alt={`Branch image ${index + 1}`}
                  className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            ))}
          </Slider>
        </section>

        {/* Sección de mensajes de la sucursal */}
        <section className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-16 sm:w-1/2 w-full p-2">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Anuncios importantes</h2>
            <Slider
              {...messagesSliderSettings}
              className="w-full max-w-screen-xl mx-auto"
              key={branchMessages.length} // Recalcular Slider cuando cambien los mensajes
            >
              {branchMessages.map((message, index) => (
                <div
                  key={index}
                  className="bg-white text-gray-800 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all"
                >
                  <div className="flex items-center justify-center mb-4">
                    <FaBullhorn className="text-3xl text-yellow-400 mr-2" />
                  </div>
                  <p className="mt-4">{message.content}</p>
                  {/* Mostrar la fecha y hora de publicación */}
                  <p className="mt-4 text-sm text-gray-600">
                    Publicado el: {formatDate(message.createdAt)}
                  </p>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>

      <footer className="w-full text-center py-6 bg-gray-900 text-white">
        <p className="text-sm">
          © 2024 - Sistema de Gestión de Sucursal | Todos los derechos reservados
        </p>
      </footer>
    </>
  );
};

export default HomeWorker;
