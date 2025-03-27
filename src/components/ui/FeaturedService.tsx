
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedServiceProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  features: string[];
  ctaText?: string;
  rating: number;
  timeEstimate: string;
}

const FeaturedService: React.FC<FeaturedServiceProps> = ({
  id,
  title,
  description,
  image,
  price,
  features,
  ctaText = "Get Started",
  rating,
  timeEstimate
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 rounded-2xl overflow-hidden shadow-glossy bg-white">
      {/* Image Container (1/3 on desktop) */}
      <div className="md:col-span-2 relative overflow-hidden h-full min-h-[200px] md:min-h-[300px]">
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
          className={`w-full h-full object-cover ${isImageLoaded ? 'opacity-0' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
        
        {/* Mobile title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-white ml-2">{rating.toFixed(1)} rating</span>
          </div>
        </div>
      </div>
      
      {/* Content Container (2/3 on desktop) */}
      <div className="md:col-span-3 p-5 md:p-8 flex flex-col justify-between">
        {/* Title and description */}
        <div className="mb-4">
          <h3 className="hidden md:block text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <div className="hidden md:flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)} rating</span>
          </div>
          
          <p className="text-gray-600 mb-6">{description}</p>
          
          {/* Service highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">100% Secure & Safe</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">{timeEstimate}</span>
            </div>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">Pro Boosters</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">Premium Support</span>
            </div>
          </div>
          
          {/* Feature list */}
          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-semibold text-gray-900">Includes:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-nitro-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
          </div>
          
          <div className="flex space-x-3 w-full sm:w-auto">
            <Link to={`/services/${id}`} className="btn-secondary flex-1 sm:flex-auto text-center flex items-center justify-center">
              Details
            </Link>
            <Link to={`/services/${id}`}>
              <Button className="btn-primary flex-1 sm:flex-auto">
                {ctaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedService;
