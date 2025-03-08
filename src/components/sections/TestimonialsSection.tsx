
import React from 'react';
import TestimonialCard from '../ui/TestimonialCard';

// Sample testimonial data
const testimonials = [
  {
    name: "Alex Johnson",
    rating: 5,
    date: "July 15, 2023",
    text: "The coaching service I received was incredible. My gameplay improved drastically after just a few sessions. Highly recommend to anyone looking to step up their game!",
    service: "Pro Coaching"
  },
  {
    name: "Sarah Williams",
    rating: 5,
    date: "August 3, 2023",
    text: "Fast and reliable boosting service. Reached my desired rank in just a few days with complete security. Will definitely use again for next season!",
    service: "Rank Boosting"
  },
  {
    name: "Michael Chen",
    rating: 4,
    date: "September 12, 2023",
    text: "Great duo queue experience. The booster was not only skilled but also gave me valuable tips during our games. Learned a lot while ranking up!",
    service: "Duo Queue"
  },
  {
    name: "Emma Rodriguez",
    rating: 5,
    date: "October 5, 2023",
    text: "Customer support was exceptional when I needed help with my order. The team went above and beyond to ensure I got exactly what I needed.",
    service: "Account Recovery"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it — hear from gamers who have experienced our services firsthand.
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TestimonialCard
                name={testimonial.name}
                rating={testimonial.rating}
                date={testimonial.date}
                text={testimonial.text}
                service={testimonial.service}
              />
            </div>
          ))}
        </div>
        
        {/* Overall rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-4 px-6 bg-nitro-50 rounded-full">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className="w-5 h-5 text-yellow-400 fill-yellow-400" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              ))}
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-gray-900">4.9 out of 5</p>
              <p className="text-sm text-gray-600">Based on 1,500+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
