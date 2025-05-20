
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText, CheckCircle, ExternalLink } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText className="h-8 w-8 text-nitro-500 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">By accessing or using the Nitrogames services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                <p>These Terms of Service apply to all visitors, users, and others who access or use our services. By accessing or using the service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Affiliate Disclosure</h2>
                <div className="flex items-start p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                  <ExternalLink className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-amber-800">
                    <strong>Important:</strong> Nitrogames is an affiliate partner for various gaming services and products. This means we may earn commissions on purchases made through links on our website. These affiliate relationships do not affect our reviews, recommendations, or the prices you pay.
                  </p>
                </div>
                <p className="mb-4">As an affiliate, we work with carefully selected partners to provide you with quality services while maintaining our commitment to transparency and customer satisfaction. All affiliate links are clearly marked throughout our website.</p>
                <p>Our primary goal remains providing exceptional service to our customers, regardless of our affiliate partnerships.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Use of Services</h2>
                <p className="mb-4">Our services are intended for personal and non-commercial use only. You agree not to use our services:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>In any way that violates any applicable national or international law or regulation</li>
                  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm or offend the Company or users of the Service or expose them to liability</li>
                  <li>To attempt to reverse engineer any software contained on our website or services</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Account Security</h2>
                <p className="mb-4">You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password.</p>
                <p className="mb-4">We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account. You agree not to disclose your password to any third party.</p>
                <p>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
                <p className="mb-4">By purchasing our services, you agree to pay all fees and charges associated with your order. All payments are processed securely through our payment providers.</p>
                <p className="mb-4">Prices for our services are subject to change without notice. We reserve the right to modify or discontinue any service without notice at any time.</p>
                <p className="mb-4">Some products and services may be provided by our affiliate partners. In these cases, your transaction may be processed by these third parties, and additional terms from these providers may apply.</p>
                <p>We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the service.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Service Delivery</h2>
                <p className="mb-4">We strive to complete all orders within the estimated timeframes provided at the time of purchase. However, completion times may vary based on several factors including game conditions, server status, and the specific requirements of your order.</p>
                <p className="mb-4">For services provided by our affiliate partners, delivery timeframes and quality standards are managed by those partners. While we carefully select our affiliates, we cannot guarantee identical delivery standards across all partners.</p>
                <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Refunds and Cancellations</h2>
                <p className="mb-4">Our refund and cancellation policies are outlined in our Refund Policy. Please refer to our Refund Policy page for detailed information about refunds and cancellations.</p>
                <p className="mb-4">For products or services provided through our affiliate partners, refunds may be subject to the affiliate's refund policy. We will assist you in processing refund requests with our partners, but cannot guarantee the outcome of such requests.</p>
                <p>In general, refunds may be provided for services that have not yet been started or completed, subject to the specific terms outlined in our Refund Policy.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
                <p className="mb-4">The Service and its original content, features, and functionality are and will remain the exclusive property of Nitrogames, INFOATLANTIC ADVISORY S.L, and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
                <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of INFOATLANTIC ADVISORY S.L.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="mb-4">In no event shall Nitrogames, INFOATLANTIC ADVISORY S.L, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Your access to or use of or inability to access or use the service</li>
                  <li>Any conduct or content of any third party on the service</li>
                  <li>Any content obtained from the service</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  <li>Any transactions or relationships between you and any third-party affiliate partners advertised on our site</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="mb-4">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
                <p>It is your responsibility to review these Terms periodically for changes. Your continued use of our Service following the posting of revised Terms means that you accept and agree to the changes.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
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

export default TermsOfService;
