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
    const videoSrc = driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : src;
    
    return (
      <video
        src={videoSrc}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        onError={() => setIsVideoError(true)}
        style={{ pointerEvents: 'none' }}
      />
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
