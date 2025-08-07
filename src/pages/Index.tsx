
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import GiftCardsSection from '@/components/sections/GiftCardsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import FeaturedService from '@/components/ui/FeaturedService';

const Index = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Featured service data
  const featuredService = {
    id: "premium-boost",
    title: "Premium Rank Boosting",
    description: "Get boosted to your desired rank by professional players with a proven track record. We offer fast, reliable, and secure boosting services for all major competitive games.",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1530&ixlib=rb-4.0.3",
    price: 79.99,
    features: [
      "Professional boosters with verified credentials",
      "Secure account handling with VPN protection",
      "Regular progress updates and communication",
      "Stream option available for complete transparency",
      "Flexible scheduling to fit your needs"
    ],
    rating: 4.9,
    timeEstimate: "24-48 hour completion"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Service */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                Featured Service
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Our Most Popular Offering
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience our premium boosting service trusted by thousands of gamers worldwide.
              </p>
            </div>
            
            <FeaturedService {...featuredService} />
          </div>
        </div>
        
        {/* Services Section */}
        <ServicesSection />
        
        {/* Gift Cards Section */}
        <GiftCardsSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
