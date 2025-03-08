
import React from 'react';
import { Shield, Users, Clock, Trophy, Zap } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="bg-nitro-50 p-3 rounded-xl inline-flex mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-nitro-600" />,
      title: "Secure Platform",
      description: "We prioritize your security with encrypted transactions and strict identity verification for all boosters."
    },
    {
      icon: <Users className="h-6 w-6 text-nitro-600" />,
      title: "Professional Team",
      description: "Our team consists of verified professional players with proven track records in competitive gaming."
    },
    {
      icon: <Clock className="h-6 w-6 text-nitro-600" />,
      title: "Fast Delivery",
      description: "Get your orders completed quickly with our efficient service delivery and real-time progress tracking."
    },
    {
      icon: <Trophy className="h-6 w-6 text-nitro-600" />,
      title: "Premium Quality",
      description: "Experience top-tier service with attention to detail and personalized approach to meet your gaming needs."
    },
    {
      icon: <Zap className="h-6 w-6 text-nitro-600" />,
      title: "Customizable Services",
      description: "Tailor our services to your specific requirements and preferences for a personalized gaming experience."
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            The Nitro Games Advantage
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We strive to provide the best experience for gamers with our premium services and dedicated support.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.slice(0, 3).map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        {/* Second row with wider spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mt-10">
          {features.slice(3, 5).map((feature, index) => (
            <Feature
              key={index + 3}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
