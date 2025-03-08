
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  category: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  image,
  rating,
  price,
  category
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div 
      className="relative overflow-hidden rounded-xl transition-all duration-300 
                 hover:shadow-card-hover group bg-white shadow-card h-full flex flex-col"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <div 
          className={`absolute inset-0 ${isImageLoaded ? '' : 'lazy-image-loading'}`} 
          style={{ 
            backgroundImage: isImageLoaded ? `url(${image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <img 
          src={image} 
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isImageLoaded ? 'opacity-0' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-md text-nitro-600">
            {category}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">{rating.toFixed(1)}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-1">{title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-nitro-500 mr-1.5" />
            <span className="text-sm font-semibold text-gray-900">${price.toFixed(2)}</span>
          </div>
          
          <Link 
            to={`/services/${id}`} 
            className="text-nitro-600 hover:text-nitro-700 font-medium text-sm flex items-center group-hover:underline transition-colors"
          >
            View Details
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
