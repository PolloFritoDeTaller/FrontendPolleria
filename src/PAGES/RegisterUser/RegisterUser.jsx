import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerRequest } from "../../api/authentication";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const newUser = { name, email, password };

    try {
      const response = await registerRequest(newUser); // Usamos la función registerRequest

      if (response?.isError) {
        return setError(response?.error?.response?.data?.message || "Error al registrar");
      }

      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 2000); // Redirige a login después de 2 segundos
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Hubo un problema al registrar el usuario. Intenta de nuevo.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 m-2">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-green-700">
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          Registrarse
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative mb-6">
            <strong className="font-semibold">Error: </strong>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-500 px-4 py-3 rounded relative mb-6">
            <strong className="font-semibold">¡Éxito! </strong>
            <span>{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmitForm}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-black text-sm font-medium mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ingresa tu nombre completo"
              required
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              maxLength={40}
              // // pattern="\d{40}"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-black text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ingresa tu correo electrónico"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              maxLength={50}
              // // pattern="\d{50}"
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-black text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ingresa tu contraseña"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              min={8}
              maxLength={16}
              // // pattern="\d{16}"
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="confirmPassword" className="block text-black text-sm font-medium mb-2">
              Confirmar Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className="w-full p-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirma tu contraseña"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Registrarse
          </button>
        </form>
        <button onClick={() => navigate("/")} className="w-full text-center text-green-700 mt-4 underline hover:text-green-900">
          Volver a la página principal
        </button>
      </div>
    </div>
  );
};

export default Register;
