
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Shield, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                About Us
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                We're Building the Future of Gaming Services
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                At NITROGAMES, we believe in providing a safe and secure platform for gamers to access premium gaming services and trade virtual goods for real money.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                  Revolutionizing Gaming Services
                </h2>
                <p className="text-gray-600 mb-6">
                  Our team of experienced professionals works tirelessly to ensure that our platform is free from scams, frauds, and any other illegal activities. We understand the value of your hard-earned money and strive to provide you with the best possible service.
                </p>
                <p className="text-gray-600 mb-8">
                  Our website is designed to be user-friendly, with easy navigation and quick access to all the information you need. We are committed to providing you with a seamless and hassle-free experience, so you can focus on what matters most – enjoying your favorite games.
                </p>
                <Link to="/services">
                  <Button className="btn-primary">Explore Our Services</Button>
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden shadow-glossy">
                <img 
                  src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3" 
                  alt="Gaming setup" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                What Drives Us Forward
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                At the core of our business are fundamental values that guide every decision we make and service we offer.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl">
                <Shield className="h-12 w-12 text-nitro-500 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trust & Security</h3>
                <p className="text-gray-600">
                  We prioritize the security of your accounts and transactions above all else, implementing industry-leading safety measures.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl">
                <Trophy className="h-12 w-12 text-nitro-500 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We're committed to delivering the highest quality services by working with only the most skilled gaming professionals.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl">
                <Users className="h-12 w-12 text-nitro-500 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
                <p className="text-gray-600">
                  We believe in building lasting relationships with our customers and fostering a supportive gaming community.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-nitro-600 py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Elevate Your Gaming Experience?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied gamers who have trusted us with their gaming needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/services">
                <Button className="bg-white text-nitro-600 hover:bg-white/90">
                  Browse Services
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
