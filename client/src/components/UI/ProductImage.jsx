import { useState } from 'react';

const ProductImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackText = 'Product',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Generate a simple fallback image
  const generateFallbackImage = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    // Text
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into multiple lines if too long
    const words = text.split(' ');
    const maxWidth = 300;
    let line = '';
    const lines = [];
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // Draw lines
    const lineHeight = 25;
    const startY = 200 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), 200, startY + index * lineHeight);
    });
    
    return canvas.toDataURL();
  };

  if (imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} {...props}>
        <img
          src={generateFallbackImage(fallbackText)}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} {...props}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;