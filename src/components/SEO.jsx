import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Enfermería Top | Insumos Médicos Profesionales", 
  description = "Tienda especializada en artículos de enfermería, insumos médicos y libretas personalizables en Chile. Calidad y diseño para profesionales de la salud.", 
  type = "website",
  url = "https://enfermeriatop.cl", // Replace with real domain if available
  schema = null
}) => {
  const fullTitle = title.includes("Enfermería Top") ? title : `${title} | Enfermería Top`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Enfermería Top",
    "image": "https://enfermeriatop.cl/logo.png", // Ensure you have a logo.png in public
    "description": "Artículos de enfermería y libretas personalizables en Chile.",
    "url": "https://enfermeriatop.cl",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CL"
    }
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
