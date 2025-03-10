import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon!"
      });

      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                Contact Us
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Get in Touch With Our Team
              </h1>
              <p className="text-gray-600">
                Have questions about our services? Need support with an order? We're here to help you.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form & Info */}
        <section className="bg-gray-50 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact information */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy h-full">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 text-nitro-500 mt-0.5 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-1">support@nitrogames.com</p>
                        <p className="text-gray-600">sales@nitrogames.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MessageSquare className="h-6 w-6 text-nitro-500 mt-0.5 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Live Chat</h3>
                        <p className="text-gray-600 mt-1">Available 24/7</p>
                        <p className="text-gray-600">Response time: under 5 minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 text-nitro-500 mt-0.5 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600 mt-1">+34 644 98 23 27</p>
                        <p className="text-gray-600">Mon-Fri, 9AM-6PM CEST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-nitro-500 mt-0.5 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Headquarters</h3>
                        <p className="text-gray-600 mt-1">Barcelona</p>
                        <p className="text-gray-600">
                      </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-nitro-50 transition-colors">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                      </a>
                      <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-nitro-50 transition-colors">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      </a>
                      <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-nitro-50 transition-colors">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                        </svg>
                      </a>
                      <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-nitro-50 transition-colors">
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nitro-500 focus:border-nitro-500" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nitro-500 focus:border-nitro-500" placeholder="your@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-nitro-500 focus:border-nitro-500" placeholder="How can we help you?" required value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea id="message" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-nitro-500 focus:border-nitro-500" placeholder="Type your message here..." required value={message} onChange={e => setMessage(e.target.value)} />
                    </div>
                    
                    <div>
                      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span> : <span className="flex items-center">
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </span>}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                FAQ
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to the most common questions about our services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[{
                question: "How do I purchase a service?",
                answer: "Simply browse our services, select the one you need, customize it according to your requirements, and proceed to checkout. We accept various payment methods including credit cards, PayPal, and cryptocurrency."
              }, {
                question: "Is my account safe with your boosters?",
                answer: "Absolutely! We take security very seriously. All our boosters are verified professionals who follow strict security protocols. We also use VPN protection to ensure your account's safety."
              }, {
                question: "How long does it take to complete a boost?",
                answer: "The completion time varies depending on the service and your specific requirements. Each service page provides an estimated completion time, and we always strive to deliver as quickly as possible without compromising quality."
              }, {
                question: "Can I track the progress of my order?",
                answer: "Yes, once your order is in progress, you'll have access to a dedicated tracking page where you can see real-time updates on your order status."
              }, {
                question: "What if I'm not satisfied with the service?",
                answer: "We have a satisfaction guarantee policy. If you're not happy with our service, please contact our support team, and we'll do our best to resolve any issues or provide a refund if necessary."
              }].map((faq, index) => <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Contact;