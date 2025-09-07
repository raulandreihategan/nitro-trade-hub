import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServiceCard from '../ui/ServiceCard';
import CustomGiftCard from '../ui/CustomGiftCard';
import { ChevronRight, Gift } from 'lucide-react';

const giftCards = [
  {
    id: "turbobit-gift",
    title: "Turbobit Gift Card",
    description: "Digital gift card for Turbobit premium services and downloads. Perfect for file sharing enthusiasts.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 25.00,
    category: "Gift Cards"
  },
  {
    id: "arsmate-gift",
    title: "Arsmate Gift Card",
    description: "Digital voucher for Arsmate platform services and exclusive content access. Great for content creators.",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 35.00,
    category: "Gift Cards"
  },
  {
    id: "custom-gift",
    title: "Custom Amount Gift Card",
    description: "Choose your own amount for the perfect gift. No minimum required - perfect for any occasion.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 5.0,
    price: 0,
    category: "Gift Cards",
    isCustom: true
  }
];

const GiftCardsSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center bg-purple-100 rounded-full px-3 py-1 text-xs font-medium text-purple-700 mb-4">
            <Gift className="w-3 h-3 mr-1" />
            Gift Cards
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Digital Gift Cards
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Perfect gifts for gamers and digital enthusiasts. Instant delivery and easy redemption for premium services.
          </p>
        </div>
        
        {/* Gift cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          {giftCards.map((giftCard) => (
            giftCard.isCustom ? (
              <CustomGiftCard
                key={giftCard.id}
                id={giftCard.id}
                title={giftCard.title}
                description={giftCard.description}
                image={giftCard.image}
                rating={giftCard.rating}
                category={giftCard.category}
              />
            ) : (
              <ServiceCard
                key={giftCard.id}
                id={giftCard.id}
                title={giftCard.title}
                description={giftCard.description}
                image={giftCard.image}
                rating={giftCard.rating}
                price={giftCard.price}
                category={giftCard.category}
              />
            )
          ))}
        </div>
        
        {/* View all button */}
        <div className="text-center">
          <Link to="/services?category=Gift Cards">
            <Button className="btn-secondary group">
              View All Gift Cards
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsSection;