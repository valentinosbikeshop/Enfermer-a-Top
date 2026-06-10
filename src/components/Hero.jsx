import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext';

const Hero = () => {
  const { heroData, loading } = useProducts();

  if (loading || !heroData) return null;

  return (
    <section id="inicio" className="relative w-full bg-turquesa/10 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
            Bienvenido a <span className="text-turquesa">Enfermería Top</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl">
            {heroData.contenido_extra || "Los mejores productos clínicos y accesorios para ti."}
          </p>
          <div className="pt-4">
            <Link to="/catalogo" className="inline-block bg-turquesa text-white px-8 py-3 rounded-full font-semibold hover:bg-turquesa/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Ver Catálogo
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative flex justify-center items-center z-10">
          <div className="absolute inset-0 bg-rosa/20 rounded-full blur-3xl transform scale-150"></div>
          <img 
            src={heroData.imagen_url} 
            alt="Topita - Mascota Enfermería Top" 
            className="relative z-10 max-h-[400px] md:max-h-[500px] object-contain drop-shadow-2xl animate-pulse-slow"
          />
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
