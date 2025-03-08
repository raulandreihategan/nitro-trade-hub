
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
  service?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  avatar,
  rating,
  date,
  text,
  service
}) => {
  // Default avatar if none provided
  const defaultAvatar = `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D8ABC&color=fff`;
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-card h-full flex flex-col transition-all duration-300 hover:shadow-card-hover">
      <div className="flex items-start mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-4">
          <img 
            src={avatar || defaultAvatar} 
            alt={name} 
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
        
        {/* User info */}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <div className="flex items-center mt-1">
            {/* Star rating */}
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3.5 w-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            
            {/* Date */}
            <span className="ml-2 text-xs text-gray-500">{date}</span>
          </div>
          
          {/* Service name if available */}
          {service && (
            <div className="mt-1">
              <span className="text-xs px-2 py-0.5 bg-nitro-50 text-nitro-700 rounded-full">
                {service}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Testimonial text */}
      <div className="mt-2 flex-grow">
        <p className="text-gray-600 text-sm italic">"{text}"</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
