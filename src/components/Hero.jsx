import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext';
import HeroMedia from './HeroMedia';

const Hero = () => {
  const { heroData, loading } = useProducts();

  if (loading || !heroData) return null;

  return (
    <section id="inicio" className="relative w-full bg-primary/5 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-pattern-medical opacity-50 mask-bottom-fade animate-bg-pan z-0"></div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 min-h-[calc(100vh-140px)] relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center md:text-left z-10 md:-mt-10">
          <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-slate-800 leading-[1.1] tracking-tight">
            Bienvenido a <br className="hidden md:block" /><span className="text-primary">Enfermería Top</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
            {heroData.contenido_extra || "Los mejores productos clínicos y accesorios para ti."}
          </p>
          <div className="pt-6">
            <Link to="/catalogo" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#c94d45] transition-all duration-300 hover-spring hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(220,90,81,0.5)]">
              Ver Catálogo
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative flex justify-center items-center z-10 w-full max-w-lg mx-auto">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-150"></div>
          <HeroMedia 
            src={heroData.imagen_url} 
            alt="Topita - Mascota Enfermería Top" 
            className="relative z-10 w-full max-h-[320px] md:max-h-[400px] object-contain drop-shadow-2xl animate-fade-in-up"
          />
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
