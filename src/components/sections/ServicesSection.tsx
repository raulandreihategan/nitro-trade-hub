
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServiceCard from '../ui/ServiceCard';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Updated service data focused on specific games and realistic gaming services
const services = [
  {
    id: "lol-boost-1",
    title: "League of Legends Rank Boost",
    description: "Fast rank boosting from Iron to Challenger by our professional LoL players.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 49.99,
    category: "Boosting",
    game: "League of Legends"
  },
  {
    id: "lol-coaching-1",
    title: "LoL Pro Coaching",
    description: "One-on-one coaching sessions with Diamond+ players to improve your skills and gameplay.",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 29.99,
    category: "Coaching",
    game: "League of Legends"
  },
  {
    id: "lol-skins-1",
    title: "LoL Skins Package",
    description: "Get access to premium and limited edition skins for your favorite champions.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 39.99,
    category: "Items & Skins",
    game: "League of Legends"
  },
  {
    id: "fortnite-vbucks-1",
    title: "Fortnite V-Bucks Bundle",
    description: "Discounted V-Bucks packages to purchase skins, emotes, and Battle Passes.",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?auto=format&fit=crop&q=80&w=1471&ixlib=rb-4.0.3",
    rating: 4.6,
    price: 19.99,
    category: "Currency",
    game: "Fortnite"
  }
];

const ServicesSection: React.FC = () => {
  const [items, setItems] = useState(services);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(4);
      if (!error && data && data.length) {
        setItems(data.map((svc: any) => ({
          id: svc.id,
          title: svc.title,
          description: svc.description,
          image: svc.image,
          rating: Number(svc.rating ?? 5),
          price: Number(svc.base_price ?? 0),
          category: svc.category,
          game: svc.game,
        })));
      }
    };
    load();
  }, []);

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
            Level up your gaming experience with our boosting, coaching, currency packages, and exclusive in-game items.
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
