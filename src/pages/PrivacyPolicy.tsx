import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Lock } from 'lucide-react';

const PrivacyPolicy = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Shield className="h-8 w-8 text-nitro-500 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-nitro-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
                </div>
                <p className="mb-4">We collect information you provide directly to us when you register for an account, make a purchase, or communicate with us. This information may include:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name and contact information</li>
                  <li>Billing information and payment details</li>
                  <li>Account credentials</li>
                  <li>Transaction information</li>
                  <li>Communications and correspondence</li>
                </ul>
                <p>We also automatically collect certain information about your device when you use our services, including:</p>
                <ul className="list-disc pl-6">
                  <li>Log information</li>
                  <li>Device information</li>
                  <li>Usage information</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Develop new products and services</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>Personalize and improve your experience</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sharing of Information</h2>
                <p className="mb-4">We may share your information as follows:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                  <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                  <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of our company or others</li>
                  <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Choices</h2>
                <p className="mb-4">You have several choices regarding the information we collect and how it's used:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Account Information: You may update, correct, or delete your account information at any time by logging into your account or contacting us</li>
                  <li>Cookies: Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject cookies</li>
                  <li>Promotional Communications: You may opt out of receiving promotional emails from us by following the instructions in those emails</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p className="font-medium">info@nitrogames.es</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
