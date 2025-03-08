
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Trophy, UserPlus } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-100">
      {/* Background elements (circles) */}
      <div className="absolute top-0 -left-60 md:-left-20 w-96 h-96 rounded-full bg-nitro-100 blur-3xl opacity-50"></div>
      <div className="absolute top-[30%] right-0 w-80 h-80 rounded-full bg-nitro-200 blur-3xl opacity-40"></div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 md:px-6 py-28 md:py-36 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up md:pr-8">
            <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-6">
              Trusted by 100k+ Gamers
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 tracking-tight">
              Level Up Your <span className="text-nitro-600">Gaming Experience</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              A safe and secure platform for gamers to access premium boosting services, coaching, and duo queue options across various games.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary text-base">
                Explore Services
              </Button>
              <Link 
                to="/about"
                className="btn-secondary text-base flex items-center justify-center"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-nitro-500 mb-2" />
                <p className="text-sm font-medium text-gray-700">Secure & Safe</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Trophy className="h-8 w-8 text-nitro-500 mb-2" />
                <p className="text-sm font-medium text-gray-700">Pro Boosters</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <UserPlus className="h-8 w-8 text-nitro-500 mb-2" />
                <p className="text-sm font-medium text-gray-700">24/7 Support</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in-up animation-delay-150">
            {/* Hero image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3" 
                alt="Professional gamer with headset" 
                className="w-full h-auto"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-nitro-700/30 to-transparent pointer-events-none"></div>
              
              {/* Stats card */}
              <div className="absolute -bottom-6 -right-6 glass-card rounded-xl p-4 md:p-6 text-center animate-fade-in-up animation-delay-300">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">100%</h3>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-nitro-100 rounded-full blur-md"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-nitro-100 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
