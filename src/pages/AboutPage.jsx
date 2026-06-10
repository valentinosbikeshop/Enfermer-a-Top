import React from 'react';
import { useProducts } from '../data/ProductsContext';
import HeroMedia from '../components/HeroMedia';
import { Heart, Star, Sparkles, Gift, Users, MapPin, Instagram, MessageCircle } from 'lucide-react';

const AboutPage = () => {
  const { heroData } = useProducts();

  const differentiators = [
    {
      icon: <Sparkles size={28} />,
      title: 'Personalización real',
      desc: 'Cada producto puede llevar nombre, frase, color o especialidad médica.',
    },
    {
      icon: <Heart size={28} />,
      title: 'Diseño pensado para ti',
      desc: 'No vendemos productos genéricos. Cada artículo está creado pensando en las necesidades reales de una enfermera en turno.',
    },
    {
      icon: <Star size={28} />,
      title: 'Calidad y practicidad',
      desc: 'Materiales resistentes, fáciles de limpiar y pensados para aguantar el ritmo hospitalario.',
    },
    {
      icon: <Gift size={28} />,
      title: 'Regalos con alma',
      desc: 'Nuestros productos son los más elegidos para el Día de la Enfermera, graduaciones y agradecimientos especiales.',
    },
    {
      icon: <Users size={28} />,
      title: 'Comunidad real',
      desc: 'No somos solo una tienda. Somos un espacio donde las enfermeras se sienten comprendidas y valoradas.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-turquesa/10 via-rosa/10 to-turquesa/5 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-turquesa/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-rosa/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-turquesa/15 text-turquesa font-semibold text-sm px-5 py-2 rounded-full mb-6">
            Sobre Nosotros
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Conoce <span className="text-turquesa">Enfermería Top</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Productos con amor para quienes cuidan con el corazón.
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-turquesa/15 text-turquesa rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Nuestra Historia</h2>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-slate-800">Enfermería Top</span> nació en Santiago de Chile con una misión clara: hacer la vida de las enfermeras más práctica, organizada y bonita.
              </p>
              <p>
                Todo comenzó cuando nos dimos cuenta de que las profesionales de la salud pasaban sus turnos luchando contra el desorden: guantes por un lado, tiritas por otro, agendas que se perdían, y cero tiempo para ellas mismas.
              </p>
              <p>
                Así que decidimos crear productos que realmente sirvieran: <span className="text-turquesa font-medium">riñoneras inteligentes</span>, <span className="text-turquesa font-medium">agendas diseñadas por y para enfermeras</span>, kits de organización, cartucheras resistentes y regalos personalizados que emocionan.
              </p>
              <p>
                Lo que empezó como una pequeña tienda en Instagram hoy es una comunidad de más de <span className="font-bold text-slate-800">15.000 personas</span> que comparten el mismo amor por la profesión y por los detalles que hacen la diferencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* Misión */}
            <div className="bg-gradient-to-br from-turquesa/5 to-turquesa/10 rounded-3xl p-8 md:p-10 border border-turquesa/10">
              <div className="w-14 h-14 bg-turquesa/20 text-turquesa rounded-2xl flex items-center justify-center mb-6">
                <Star size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Misión</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Facilitar el día a día de las enfermeras y estudiantes de enfermería entregando productos útiles, bonitos y 100% personalizados que les permitan llegar al turno con todo bajo control y cero estrés.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gradient-to-br from-rosa/10 to-rosa/20 rounded-3xl p-8 md:p-10 border border-rosa/20">
              <div className="w-14 h-14 bg-rosa/30 text-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Visión</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Ser la tienda #1 en Chile de productos personalizados para el gremio de la salud, combinando funcionalidad, diseño y un toque de cariño que solo entiende quien vive la profesión.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Qué nos hace diferentes */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Qué nos hace diferentes</h2>
            <div className="w-20 h-1 bg-turquesa rounded-full mx-auto"></div>
          </div>
          
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-turquesa/10 text-turquesa rounded-2xl flex items-center justify-center mb-5 group-hover:bg-turquesa group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Nuestros Valores</h2>
            <div className="w-20 h-1 bg-rosa rounded-full mx-auto"></div>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { valor: 'Practicidad', significado: 'Cada producto debe resolver un problema real', emoji: '🎯' },
              { valor: 'Personalización', significado: 'Tú eres única, tu producto también', emoji: '✨' },
              { valor: 'Cariño', significado: 'Detrás de cada pedido hay una historia y una persona que importa', emoji: '💗' },
              { valor: 'Calidad', significado: 'Materiales que duran turnos, semanas y años', emoji: '🏅' },
              { valor: 'Comunidad', significado: 'Crecemos juntos con las enfermeras que nos eligen', emoji: '🤝' },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-5 bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:border-turquesa/20 transition-all duration-300"
              >
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{item.valor}</h3>
                  <p className="text-slate-500">{item.significado}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topita Section */}
      <section className="py-20 bg-gradient-to-br from-rosa/10 via-white to-turquesa/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            
            {/* Topita Image */}
            {heroData && heroData.imagen_url && (
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-rosa/30 rounded-full blur-3xl scale-150"></div>
                <HeroMedia 
                  src={heroData.imagen_url} 
                  alt="Topita - Mascota oficial de Enfermería Top" 
                  className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                />
              </div>
            )}

            {/* Topita Text */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-rosa/30 text-slate-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                🧸 Nuestra Mascota
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Topita – Nuestra compañera oficial
              </h2>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>
                  En marzo de 2026 llegó <span className="font-semibold text-slate-800">Topita</span>, nuestra adorable mascota oficial.
                </p>
                <p>
                  Topita es un osito blanco con uniforme de enfermera que representa todo lo que queremos transmitir: <span className="text-turquesa font-medium">alegría, apoyo, ternura y profesionalismo</span>.
                </p>
                <p>
                  Ella aparece en nuestros reels, diseños y empaques para recordarte que, aunque el turno sea pesado, siempre hay un motivo para sonreír. Topita ya es parte de la familia de miles de enfermeras que la reciben con cariño en cada pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-turquesa/15 text-turquesa rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">¿Dónde estamos?</h2>
            <p className="text-lg text-slate-600">
              Santiago, Chile — Enviamos a todo el país con amor y rapidez. 💜
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-turquesa to-turquesa/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Quieres conocernos más?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-4">
            Te invitamos a seguirnos en Instagram <span className="font-semibold text-white">@enfermeria_top</span>, donde compartimos tips, reels útiles, unboxings y mucho contenido hecho con el corazón.
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            ¿Tienes una idea? ¿Quieres un producto personalizado especial?<br />
            Escríbenos por WhatsApp o por el formulario de contacto. ¡Estamos aquí para ti!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://www.instagram.com/enfermeria_top" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-3.5 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Instagram size={20} />
              Síguenos en Instagram
            </a>
            <a 
              href="https://wa.me/56996793455" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 text-white border-2 border-white/40 px-8 py-3.5 rounded-full font-bold hover:bg-white/30 hover:-translate-y-1 transition-all"
            >
              <MessageCircle size={20} />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
