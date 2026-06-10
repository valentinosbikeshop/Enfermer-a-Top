import React, { useState, useEffect } from 'react';

const HeroMedia = ({ src, alt, className }) => {
  const [isVideoError, setIsVideoError] = useState(false);

  useEffect(() => {
    setIsVideoError(false);
  }, [src]);

  if (!src) return null;

  let driveId = null;
  // Check if it's the converted lh3 url
  const lh3Match = src.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match) {
    driveId = lh3Match[1];
  } else {
    // Check if it's a raw drive url
    const driveMatch = src.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      driveId = driveMatch[1];
    } else {
      const idParamMatch = src.match(/drive\.google\.com\/(?:open|uc)\?.*?id=([a-zA-Z0-9_-]+)/);
      if (idParamMatch) driveId = idParamMatch[1];
    }
  }

  // If we know it's an image extension, don't even try video
  const isImageExt = src.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

  if (!isVideoError && !isImageExt && (driveId || src.match(/\.(mp4|webm|ogg)$/i))) {
    const videoSrc = driveId ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download` : src;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          src={videoSrc}
          className={className}
          autoPlay
          loop
          muted
          playsInline
          crossOrigin="anonymous"
          onError={(e) => {
            console.error('Video load failed, falling back to image:', e);
            setIsVideoError(true);
          }}
        />
      </div>
    );
  }

  // Fallback to image
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      loading="lazy"
    />
  );
};

export default HeroMedia;
