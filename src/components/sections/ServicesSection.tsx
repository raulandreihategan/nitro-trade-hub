
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServiceCard from '../ui/ServiceCard';
import { ChevronRight } from 'lucide-react';

// Sample service data
const services = [
  {
    id: "boost-1",
    title: "Rank Boosting",
    description: "Fast and reliable rank boosting by professional players. Achieve your desired rank in no time.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 49.99,
    category: "Boosting"
  },
  {
    id: "coaching-1",
    title: "Pro Coaching",
    description: "One-on-one coaching sessions with professional players to improve your skills and gameplay.",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 29.99,
    category: "Coaching"
  },
  {
    id: "duo-1",
    title: "Duo Queue",
    description: "Play with a professional player who will help you win games and improve your rank.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 39.99,
    category: "Duo Queue"
  },
  {
    id: "recover-1",
    title: "Account Recovery",
    description: "Recover your banned or hacked account with our professional assistance.",
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.6,
    price: 59.99,
    category: "Recovery"
  }
];

const ServicesSection: React.FC = () => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Premium Gaming Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From boosting to coaching, we offer a wide range of services to help you elevate your gaming experience.
          </p>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              rating={service.rating}
              price={service.price}
              category={service.category}
            />
          ))}
        </div>
        
        {/* View all button */}
        <div className="text-center">
          <Link to="/services">
            <Button className="btn-secondary group">
              View All Services
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
