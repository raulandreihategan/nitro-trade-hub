
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Trophy, Users, Clock, Star } from 'lucide-react';

const About = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Team members data
  const teamMembers = [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
      bio: "Former professional esports player with over 10 years of experience in the gaming industry."
    },
    {
      name: "Sarah Chen",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1522&ixlib=rb-4.0.3",
      bio: "Business management expert who ensures smooth and efficient service delivery for all clients."
    },
    {
      name: "Michael Torres",
      role: "Lead Booster",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
      bio: "Top-ranked player in multiple games with a passion for helping others improve their skills."
    },
    {
      name: "Emma Lewis",
      role: "Customer Support Manager",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
      bio: "Dedicated to providing exceptional customer service and ensuring client satisfaction."
    }
  ];

  // Stats data
  const stats = [
    { label: "Happy Customers", value: "100k+" },
    { label: "Orders Completed", value: "250k+" },
    { label: "Professional Boosters", value: "50+" },
    { label: "Satisfaction Rate", value: "99.8%" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white to-gray-100 pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-6 animate-fade-in">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 animate-fade-in-up">
              About Nitro Games
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              A safe and secure platform for gamers to trade virtual goods and access premium boosting services.
            </p>
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1471&ixlib=rb-4.0.3" 
                      alt="Professional gamers" 
                      className="w-full h-auto"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-nitro-700/20 to-transparent pointer-events-none"></div>
                  </div>
                </div>
                <div>
                  <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-6">
                    Our Mission
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
                    Providing a Safe and Secure Gaming Platform
                  </h2>
                  <p className="text-gray-600 mb-6">
                    At Nitro Games, we believe in providing a safe and secure platform for gamers to trade virtual goods and currencies for real money. Our team of experienced professionals works tirelessly to ensure that our website is free from scams, frauds, and any other illegal activities.
                  </p>
                  <p className="text-gray-600">
                    We understand the value of your hard-earned money and strive to provide you with the best possible service. Our website is designed to be user-friendly, with easy navigation and quick access to all the information you need. We are committed to providing you with a seamless and hassle-free trading experience, so you can focus on what matters most – enjoying your favorite games.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                What We Stand For
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our core values guide everything we do and shape how we serve our community of gamers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-card">
                <div className="bg-nitro-50 p-3 rounded-xl inline-flex mb-6">
                  <Shield className="h-6 w-6 text-nitro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Security & Trust</h3>
                <p className="text-gray-600">
                  We prioritize the security of your accounts and personal information. All transactions are encrypted and our boosters are carefully vetted.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-card">
                <div className="bg-nitro-50 p-3 rounded-xl inline-flex mb-6">
                  <Trophy className="h-6 w-6 text-nitro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every service we provide. Our team consists of top-tier players who maintain the highest standards of quality.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-card">
                <div className="bg-nitro-50 p-3 rounded-xl inline-flex mb-6">
                  <Users className="h-6 w-6 text-nitro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
                <p className="text-gray-600">
                  We're building more than a service—we're fostering a community of passionate gamers who share knowledge and support each other.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-8 rounded-xl text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-nitro-600 mb-2">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Meet the Experts
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our team of gaming professionals is dedicated to providing you with the best possible service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-white/80 text-sm">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Commitment Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-6">
                Our Commitment
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Why Gamers Trust Nitro Games
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                We're committed to providing a platform that gamers can trust completely. Here's what sets us apart:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="bg-nitro-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-nitro-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Reliable Service</h3>
                    <p className="text-gray-600">
                      We understand the value of your time. Our services are delivered promptly without compromising on quality.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-nitro-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-nitro-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Transactions</h3>
                    <p className="text-gray-600">
                      All payments are processed through secure gateways with encryption technology to protect your financial information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-nitro-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <Trophy className="h-6 w-6 text-nitro-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Boosters</h3>
                    <p className="text-gray-600">
                      Our team consists of professional gamers with proven track records in competitive gaming across multiple titles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-nitro-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <Star className="h-6 w-6 text-nitro-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Satisfaction Guarantee</h3>
                    <p className="text-gray-600">
                      We're confident in our services. If you're not completely satisfied, we'll work with you to make it right.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
