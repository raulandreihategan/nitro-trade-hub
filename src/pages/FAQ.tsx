
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="text-gray-600">{answer}</div>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqCategories = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What is NitroLeague?",
          answer: "NitroLeague is a platform offering premium gaming services including rank boosting, coaching, account recovery, and more to help gamers improve their gaming experience and achieve their desired ranks."
        },
        {
          question: "Which games do you support?",
          answer: "We currently support a wide range of popular games including League of Legends, Valorant, Call of Duty, Fortnite, World of Warcraft, Dota 2, CS:GO, Overwatch, Apex Legends, Rainbow Six Siege, and more. We're constantly expanding our services to include more games."
        },
        {
          question: "Are your services safe to use?",
          answer: "Yes, we take security very seriously. All our boosters use VPN protection and follow strict security protocols to ensure your account remains safe. We also have a proven track record of satisfied customers who have used our services without any issues."
        },
        {
          question: "How do I contact customer support?",
          answer: "You can reach our customer support team through the Contact page on our website, by emailing support@nitroleague.com, or by using the live chat feature available on our site. We aim to respond to all inquiries within 24 hours."
        }
      ]
    },
    {
      title: "Boosting Services",
      faqs: [
        {
          question: "How does the boosting process work?",
          answer: "After you purchase a boosting package, one of our professional boosters will be assigned to your order. They will log into your account at the scheduled times and play games to boost your rank. You'll receive regular updates on progress, and you can request specific champions/heroes to be played if desired."
        },
        {
          question: "How long does boosting take?",
          answer: "The time varies depending on your current rank, target rank, and the game. Generally, it takes 24-48 hours to complete a standard boosting order, but larger rank jumps may take longer. We provide estimated timeframes for each service when you place your order."
        },
        {
          question: "Can I play on my account during the boosting process?",
          answer: "We recommend not playing on your account during the boosting process to avoid any potential issues or delays. However, if you need to play, please communicate with your booster to coordinate schedules."
        },
        {
          question: "What if I'm not satisfied with the boosting service?",
          answer: "We offer a satisfaction guarantee. If you're not happy with our service for any reason, please contact our support team, and we'll make it right, either by continuing the boost until you're satisfied or providing a partial or full refund as appropriate."
        }
      ]
    },
    {
      title: "Payments & Refunds",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and various cryptocurrency payments. All payments are processed securely through our payment providers, ensuring your financial information remains safe."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely. We use industry-standard encryption and secure payment processors. We never store your full credit card details on our servers."
        },
        {
          question: "What is your refund policy?",
          answer: "We offer refunds under specific circumstances as outlined in our Refund Policy. Generally, if we are unable to complete your order or if there's a significant delay, you are eligible for a refund. Please refer to our Refund Policy page for complete details."
        },
        {
          question: "Do you offer any discounts or promotions?",
          answer: "Yes, we regularly run promotions and offer discounts for returning customers. Subscribe to our newsletter or follow us on social media to stay updated on our latest deals and promotions."
        }
      ]
    },
    {
      title: "Account & Privacy",
      faqs: [
        {
          question: "Is my account information safe with you?",
          answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your data with third parties except as necessary to provide our services. Please refer to our Privacy Policy for more details."
        },
        {
          question: "Can I create an account without making a purchase?",
          answer: "Yes, you can create an account to browse our services, save your preferences, and receive personalized recommendations without making an immediate purchase."
        },
        {
          question: "How do I delete my account?",
          answer: "You can delete your account by going to your account settings and selecting the 'Delete Account' option. Alternatively, you can contact our support team, and they will assist you with the account deletion process."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <MessageCircle className="h-8 w-8 text-nitro-500 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
            </div>
            
            <p className="text-gray-600 mb-10">
              Find answers to the most common questions about our services. If you can't find what you're looking for, feel free to contact our support team.
            </p>
            
            {faqCategories.map((category, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
                
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <FAQItem 
                      key={faqIndex} 
                      question={faq.question} 
                      answer={faq.answer} 
                    />
                  ))}
                </div>
              </div>
            ))}
            
            <div className="bg-nitro-50 p-6 md:p-8 rounded-xl mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                If you couldn't find the answer to your question, our support team is here to help.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center font-medium text-nitro-600 hover:text-nitro-700"
              >
                Contact Us
                <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
