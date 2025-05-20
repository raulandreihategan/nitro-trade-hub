import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Receipt, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
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
              <Receipt className="h-8 w-8 text-nitro-500 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Refund Policy</h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Eligibility</h2>
                <p className="mb-4">We want you to be completely satisfied with your purchase. However, due to the nature of our digital services, we have specific guidelines for refunds:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Eligible for Refund</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Services that have not been started</li>
                          <li>Services that cannot be completed due to technical issues on our end</li>
                          <li>Services that significantly fail to meet the described standards</li>
                          <li>Duplicate charges or billing errors</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Not Eligible for Refund</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Services that have been completed</li>
                          <li>Services already in progress, unless specified otherwise</li>
                          <li>Services that cannot be completed due to incorrect information provided by the customer</li>
                          <li>Refund requests made beyond 14 days from purchase</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p>All refund requests are handled on a case-by-case basis, and our team will review each request carefully.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Process</h2>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nitro-50 flex items-center justify-center mr-4">
                      <span className="text-nitro-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Submit a Refund Request</h3>
                      <p className="text-gray-600">Contact our support team through the <Link to="/contact" className="text-nitro-600 hover:text-nitro-700">Contact Page</Link> or by emailing support@nitroleague.com with your order details and reason for the refund.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nitro-50 flex items-center justify-center mr-4">
                      <span className="text-nitro-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Review Process</h3>
                      <p className="text-gray-600">Our team will review your request and determine if it meets our refund eligibility criteria. This typically takes 1-3 business days.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nitro-50 flex items-center justify-center mr-4">
                      <span className="text-nitro-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Refund Decision</h3>
                      <p className="text-gray-600">Once a decision is made, you will be notified via email. If approved, the refund will be processed to your original payment method.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nitro-50 flex items-center justify-center mr-4">
                      <span className="text-nitro-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Refund Processing</h3>
                      <p className="text-gray-600">Approved refunds are typically processed within 5-7 business days, although it may take longer depending on your financial institution.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancellations</h2>
                <div className="flex items-start mb-4">
                  <Clock className="h-5 w-5 text-nitro-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">You may cancel an order at any time before it has been started. For orders that are already in progress, cancellation and refund eligibility will depend on the specific circumstances and stage of completion.</p>
                </div>
                <p className="text-gray-600">To cancel an order, please contact our support team as soon as possible with your order details and cancellation request.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Exceptions and Special Circumstances</h2>
                <p className="mb-4">We understand that special circumstances may arise. In cases of:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-600">
                  <li>Extended service delays beyond our estimated timeframes</li>
                  <li>Service quality falling significantly below described standards</li>
                  <li>Unexpected account issues directly resulting from our services</li>
                </ul>
                <p className="text-gray-600">Please contact our support team to discuss your specific situation. We will work with you to find an appropriate resolution, which may include partial or full refunds, service credits, or other accommodations.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">If you have any questions about our Refund Policy, please contact us at:</p>
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

export default RefundPolicy;
