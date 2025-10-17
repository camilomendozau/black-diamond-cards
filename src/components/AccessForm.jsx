import { useState } from "react";

const STORED_HASH =
  "403a5db6359ecf80413ff47ad1ae2f04aee83da71ffba610429084da15fb1c87";
const SALT = "Diamante"; // mismo usado para generar el hash

async function sha256Hex(message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AccessForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hash = await sha256Hex(password + SALT);
    console.log(hash);

    if (hash === STORED_HASH) {
      const now = Date.now();
      const token = await sha256Hex(STORED_HASH + "|" + now);
      localStorage.setItem("astro_training_token", token);
      localStorage.setItem("astro_training_ts", String(now));
      window.location.href = "/capacitacion/modulo1"; // ⬅️ redirige directamente al primer módulo
    } else {
      setError("Contraseña incorrecta, pide la contraseña a tu socio");
    }
  };

  return (
    <div className="flex flex-col justify-center w-[95%] sm:w-[95%] md:w-[70%] lg:w-[35%] sm:h-[50%] mt-20 bg-white p-7 sm:py-10 sm:px-15 shadow-lg rounded-2xl">
      <h1 className="lg:text-2xl sm:text-7xl font-semibold mb-6 text-center">
        Acceso a la Capacitación
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="password"
          className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full mb-4 text-base sm:text-5xl lg:text-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="Ingresa la contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white lg:text-lg sm:text-5xl sm:my-6 font-medium w-full lg:py-3 sm:py-12 lg:rounded-2xl sm:rounded-4xl hover:bg-green-700 transition"
        >
          Entrar
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center lg:text-xl sm:text-4xl">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
