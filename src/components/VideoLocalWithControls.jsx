import React, { useRef, useState, useEffect } from "react";

export default function VideoWithControls({ src, showButtonAt = 60 }) {
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [maxTime, setMaxTime] = useState(0); // tiempo máximo visto

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reproduce automáticamente
    video.play().catch(() => {
      // algunos navegadores bloquean autoplay sin interacción
      console.log("Autoplay bloqueado hasta interacción del usuario");
    });

    // Actualiza el tiempo máximo visto
    const handleTimeUpdate = () => {
      if (video.currentTime > maxTime) setMaxTime(video.currentTime);
      if (video.currentTime >= showButtonAt) setShowButton(true);
    };

    // Impide adelantar manualmente
    const handleSeeking = () => {
      if (video.currentTime > maxTime + 0.5) {
        video.currentTime = maxTime;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
    };
  }, [maxTime, showButtonAt]);

  const goToNextSection = () => {
    window.location.href = "/"; // cambia por tu ruta destino
  };

  return (
    <div className="relative md:w-2/3 md:h-5/6 w-9/10 h-4/8 aspect-video rounded-lg overflow-hidden shadow-2xl mx-10 background-colors flex items-center justify-center">
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{ width: "100%", height: "100%" }}
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      {showButton && (
        <button
          onClick={goToNextSection}
          className="absolute bottom-5 right-5 px-5 py-2 bg-green-600 text-white rounded-lg text-base font-semibold shadow-md hover:bg-green-700 transition"
        >
          Ir a la siguiente sección
        </button>
      )}
    </div>
  );
}
