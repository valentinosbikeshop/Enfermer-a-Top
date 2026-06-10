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

  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoadingBlob, setIsLoadingBlob] = useState(false);

  useEffect(() => {
    setIsVideoError(false);
    let objectUrl = null;
    
    // If we have a driveId and it's not an image extension, fetch as Blob
    if (driveId && !src.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      setIsLoadingBlob(true);
      const fetchVideo = async () => {
        try {
          const res = await fetch(`https://drive.usercontent.google.com/download?id=${driveId}&export=view`);
          if (!res.ok) throw new Error('Fetch failed');
          const blob = await res.blob();
          
          // Check if it's actually an html/error page instead of a video
          if (blob.type.includes('text/html')) throw new Error('Received HTML instead of video');
          
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        } catch (e) {
          console.error('Failed to load video blob:', e);
          setIsVideoError(true);
        } finally {
          setIsLoadingBlob(false);
        }
      };
      fetchVideo();
    }
    
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src, driveId]);

  // If we know it's an image extension, don't even try video
  const isImageExt = src.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

  if (!isVideoError && !isImageExt && (driveId || src.match(/\.(mp4|webm|ogg)$/i))) {
    const videoSrc = driveId ? blobUrl : src;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {isLoadingBlob && (
           <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-turquesa"></div>
           </div>
        )}
        {videoSrc && (
          <video
            src={videoSrc}
            className={className}
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              console.error('Video load failed, falling back to image:', e);
              setIsVideoError(true);
            }}
          />
        )}
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
