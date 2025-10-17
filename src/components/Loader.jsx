import React from 'react';

export default function Loader ({isLoading}) {
  if(!isLoading) return null;
  return (
    <div id="loader" className="d-flex justify-content-center align-items-center flex-column text-zinc-900">
      <img src="https://bioliffe.life/wp-content/uploads/FAVICON_BIOLIFFE.png" alt="logo-icon" className="w-10 md:w-30 animate-bounce" />
      <p>Cargando PDF...</p>
    </div>
  )
}