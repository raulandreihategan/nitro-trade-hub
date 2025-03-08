
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-nitro-600 to-nitro-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-nitro-300 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-60 h-60 bg-nitro-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-nitro-500 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white mb-6">
            Ready to Level Up?
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Start Your Gaming Journey With Nitro Games Today
          </h2>
          
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied gamers who have transformed their gaming experience with our premium services.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/services">
              <Button className="bg-white text-nitro-700 hover:bg-gray-100 px-8 py-6 text-base font-medium rounded-lg transition-all shadow-lg hover:shadow-xl">
                Explore Services
              </Button>
            </Link>
            
            <Link to="/contact" className="group flex items-center text-white font-medium hover:text-white/90 transition-colors">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 text-white/80">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              100% Secure Payments
            </p>
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              24/7 Customer Support
            </p>
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
