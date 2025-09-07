import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, ArrowRight, Gift } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

interface CustomGiftCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  category: string;
}

const CustomGiftCard: React.FC<CustomGiftCardProps> = ({
  id,
  title,
  description,
  image,
  rating,
  category
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const amount = parseFloat(customAmount) || 0;

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
          <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-md text-nitro-600">
            <Gift className="w-3 h-3 mr-1" />
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
            Custom
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
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-4">
          <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Amount ($)
          </label>
          <Input
            id="custom-amount"
            type="text"
            placeholder="0.00"
            value={customAmount}
            onChange={handleAmountChange}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">No minimum amount required</p>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-nitro-500 mr-1.5" />
            <span className="text-sm font-semibold text-gray-900">
              ${amount > 0 ? amount.toFixed(2) : '0.00'}
            </span>
          </div>
          
          {amount > 0 ? (
            <Link 
              to={`/services/${id}?amount=${amount}`} 
              className="text-nitro-600 hover:text-nitro-700 font-medium text-sm flex items-center group-hover:underline transition-colors"
            >
              Customize
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Button 
              disabled 
              size="sm" 
              variant="outline"
              className="text-xs"
            >
              Enter Amount
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomGiftCard;