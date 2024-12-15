import { useState } from "react";
import { useAuth } from "../GENERALCOMPONENTS/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    const res = await signIn(data);

    if (res.isError) {
      return setError(res.error.response.data.message);
    }

    navigate("/inicio"); // Redirige a la página de inicio después de un inicio de sesión exitoso
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 m-2">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-red-700">
        <h2 className="text-3xl font-bold mb-6 text-red-700 text-center">
          Iniciar Sesión
        </h2>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-semibold">Error: </strong>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmitForm}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-black text-sm font-medium mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
              placeholder="Ingresa tu correo electrónico"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-black text-sm font-medium mb-2"
            >
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
              placeholder="Ingresa tu contraseña"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-900 mb-4"
          >
            Iniciar Sesión
          </button>
        </form>
        {/* Botón para Volver al inicio */}
        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-red-700 mt-4 underline hover:text-red-900 transition-colors"
        >
          Volver al inicio
        </button>

        {/* Pregunta para redirigir a la página de registro */}
        <div className="text-center mt-4">
          <p className="text-sm">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate('/registro')}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Crea una
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
