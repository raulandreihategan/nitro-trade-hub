import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Clock, Shield, Trophy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import { supabase } from "@/integrations/supabase/client";

const services = [
  {
    id: "boost-1",
    title: "Rank Boosting",
    description: "Fast and reliable rank boosting by professional players. Achieve your desired rank in no time.",
    fullDescription: "Our rank boosting service is designed to help you reach your desired rank quickly and efficiently. Our team of professional players will play on your account and boost your rank while maintaining a high win rate. We guarantee a secure and reliable service, with regular updates on progress.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.8,
    reviews: 156,
    price: 49.99,
    category: "Boosting",
    game: "League of Legends",
    timeEstimate: "24-48 hours",
    features: [
      "Professional boosters with 5+ years of experience",
      "Secure account handling with VPN protection",
      "Regular progress updates and communication",
      "Stream option available for complete transparency",
      "Flexible scheduling to fit your needs"
    ],
    options: [
      {
        id: "basic",
        name: "Basic Boost",
        description: "Standard rank boosting service",
        price: 49.99
      },
      {
        id: "premium",
        name: "Premium Boost",
        description: "Faster boosting with priority service",
        price: 79.99
      },
      {
        id: "vip",
        name: "VIP Boost",
        description: "Our fastest boosting service with dedicated boosters",
        price: 119.99
      }
    ],
    faqs: [
      {
        question: "How long does the boosting process take?",
        answer: "The time varies depending on your current rank and your target rank. Generally, it takes 24-48 hours to complete a standard boosting order."
      },
      {
        question: "Is my account safe?",
        answer: "Yes, we take security very seriously. Our boosters use VPN protection and follow strict security protocols to ensure your account's safety."
      },
      {
        question: "Can I play on my account during the boosting process?",
        answer: "We recommend not playing on your account during the boosting process to avoid any potential issues or delays."
      },
      {
        question: "What if I'm not satisfied with the service?",
        answer: "We have a satisfaction guarantee. If you're not happy with our service, please contact our support team, and we'll make it right."
      }
    ]
  },
  {
    id: "coaching-1",
    title: "Pro Coaching",
    description: "One-on-one coaching sessions with professional players to improve your skills and gameplay.",
    fullDescription: "Our professional coaching service connects you with top-tier players who will analyze your gameplay, identify areas for improvement, and provide personalized guidance. Each session is tailored to your specific needs, whether you're looking to improve your mechanics, game knowledge, or strategic thinking.",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.9,
    reviews: 89,
    price: 29.99,
    category: "Coaching",
    game: "Multiple Games",
    timeEstimate: "1-2 hours per session",
    features: [
      "One-on-one sessions with professional players",
      "Personalized feedback and improvement plans",
      "VOD review and analysis",
      "Flexible scheduling options",
      "Follow-up support after sessions"
    ],
    options: [
      {
        id: "single",
        name: "Single Session",
        description: "One coaching session (1 hour)",
        price: 29.99
      },
      {
        id: "package",
        name: "Coaching Package",
        description: "Five coaching sessions (5 hours total)",
        price: 124.99
      },
      {
        id: "premium",
        name: "Premium Coaching",
        description: "Ten coaching sessions with priority scheduling",
        price: 229.99
      }
    ],
    faqs: [
      {
        question: "How do I schedule a coaching session?",
        answer: "After purchasing, you'll receive a link to our scheduling system where you can choose a time that works for you and your coach."
      },
      {
        question: "What do I need for a coaching session?",
        answer: "You'll need a stable internet connection, Discord for communication, and the game you want coaching for installed on your device."
      },
      {
        question: "Can I request a specific coach?",
        answer: "Yes, you can request a specific coach when scheduling your session, subject to availability."
      },
      {
        question: "What if I need to reschedule?",
        answer: "You can reschedule your session up to 24 hours before the scheduled time. Please contact our support team if you need to reschedule with less notice."
      }
    ]
  },
  {
    id: "duo-1",
    title: "Duo Queue",
    description: "Play with a professional player who will help you win games and improve your rank.",
    fullDescription: "Our Duo Queue service pairs you with a professional player who will play alongside you to help you win games and climb the ranks. This is a great option for players who want to learn in a real-game environment while also improving their rank. Our professionals will communicate with you throughout the games to provide tips and guidance.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.7,
    reviews: 124,
    price: 39.99,
    category: "Duo Queue",
    game: "League of Legends",
    timeEstimate: "Varies by package",
    features: [
      "Play with professional players with proven track records",
      "Learn through real game scenarios",
      "Improve your rank while learning",
      "Voice communication during games",
      "Flexible scheduling to fit your availability"
    ],
    options: [
      {
        id: "basic",
        name: "Basic Duo (5 Games)",
        description: "5 games with a professional player",
        price: 39.99
      },
      {
        id: "standard",
        name: "Standard Duo (10 Games)",
        description: "10 games with a professional player",
        price: 74.99
      },
      {
        id: "premium",
        name: "Premium Duo (20 Games)",
        description: "20 games with a professional player",
        price: 129.99
      }
    ],
    faqs: [
      {
        question: "How do we communicate during the games?",
        answer: "We primarily use Discord for voice communication, but we can accommodate other platforms if preferred."
      },
      {
        question: "What regions do you support?",
        answer: "We currently support NA, EU, and Asia regions. Please specify your region when purchasing."
      },
      {
        question: "Can I choose the professional player?",
        answer: "You can request specific players, subject to their availability. We'll always try to accommodate your preferences."
      },
      {
        question: "What if we lose games?",
        answer: "While our goal is to win every game, losses can happen. We focus on providing a learning experience regardless of the outcome."
      }
    ]
  },
  {
    id: "recover-1",
    title: "Account Recovery",
    description: "Recover your banned or hacked account with our professional assistance.",
    fullDescription: "Our Account Recovery service helps you regain access to your gaming accounts that have been banned, hacked, or otherwise compromised. Our team of experts works directly with game publishers and platforms to resolve account issues and get you back in the game as quickly as possible.",
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.6,
    reviews: 78,
    price: 59.99,
    category: "Recovery",
    game: "Multiple Games",
    timeEstimate: "3-7 days",
    features: [
      "Expert assistance with account recovery procedures",
      "Direct communication with game publishers",
      "Documentation preparation and submission",
      "Security review and recommendations",
      "Follow-up support after recovery"
    ],
    options: [
      {
        id: "standard",
        name: "Standard Recovery",
        description: "Basic account recovery service",
        price: 59.99
      },
      {
        id: "priority",
        name: "Priority Recovery",
        description: "Expedited account recovery with priority support",
        price: 99.99
      },
      {
        id: "complex",
        name: "Complex Recovery",
        description: "For accounts with complex issues or multiple platforms",
        price: 149.99
      }
    ],
    faqs: [
      {
        question: "What information do I need to provide?",
        answer: "You'll need to provide any available account details, proof of ownership, and information about how the account was lost or compromised."
      },
      {
        question: "Is account recovery guaranteed?",
        answer: "While we have a high success rate, recovery cannot be guaranteed as it depends on many factors including game publisher policies and the specific situation."
      },
      {
        question: "How long does recovery take?",
        answer: "Most accounts are recovered within 3-7 days, but complex cases may take longer. Priority service reduces wait times when possible."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take security seriously and protect all client information with industry-standard encryption and security practices."
      }
    ]
  }
];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState(services.find(s => s.id === id));
  const [selectedOption, setSelectedOption] = useState(service?.options[0]);
  const [showReviews, setShowReviews] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState(service?.image);
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setService(services.find(s => s.id === id));
  }, [id]);

  useEffect(() => {
    if (service) {
      setSelectedOption(service.options[0]);
      setMainImage(service.image);
    }
  }, [service]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your cart.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (service && selectedOption) {
      await addItem({
        service_id: service.id,
        service_title: service.title,
        option_id: selectedOption.id,
        option_name: selectedOption.name,
        price: selectedOption.price
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="mb-6">
            <nav className="flex text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link to="/services" className="text-gray-500 hover:text-gray-700">Services</Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-900">{service?.title || 'Service'}</span>
            </nav>
          </div>
          
          {!service ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
              <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
              <Link to="/services">
                <Button>Browse All Services</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 aspect-[16/9]">
                    <img 
                      src={mainImage} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {service.gallery.map((img, index) => (
                      <div 
                        key={index} 
                        className={`rounded-lg overflow-hidden cursor-pointer border-2 ${
                          mainImage === img ? 'border-nitro-500' : 'border-transparent'
                        }`}
                        onClick={() => setMainImage(img)}
                      >
                        <img 
                          src={img} 
                          alt={`${service.title} - image ${index + 1}`}
                          className="w-full h-full object-cover aspect-[16/9]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="bg-white p-6 rounded-xl shadow-glossy">
                    <div className="flex items-center mb-2">
                      <span className="inline-block bg-nitro-50 rounded-full px-2.5 py-0.5 text-xs font-medium text-nitro-700 mr-2">
                        {service.category}
                      </span>
                      <span className="inline-block bg-blue-50 rounded-full px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {service.game}
                      </span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
                    
                    <div className="flex items-center mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < service.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {service.rating.toFixed(1)} ({service.reviews} reviews)
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-6">{service.fullDescription}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">100% Secure & Safe</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{service.timeEstimate}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Pro Boosters</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Premium Support</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package</h3>
                      
                      <div className="space-y-3">
                        {service.options.map((option) => (
                          <div
                            key={option.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedOption?.id === option.id
                                ? 'border-nitro-500 bg-nitro-50'
                                : 'border-gray-200 hover:border-nitro-200'
                            }`}
                            onClick={() => setSelectedOption(option)}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{option.name}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">${option.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      className="w-full flex items-center justify-center text-base btn-primary"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Features</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-nitro-50 rounded-full p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-nitro-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {service.faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          className="flex justify-between items-center w-full p-4 text-left"
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedFaq === index && (
                          <div className="p-4 pt-0 text-gray-600 border-t border-gray-200">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <button
                  className="flex items-center text-nitro-600 font-medium"
                  onClick={() => setShowReviews(!showReviews)}
                >
                  {showReviews ? (
                    <>
                      <ChevronUp className="mr-2 h-5 w-5" />
                      Hide Customer Reviews
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-5 w-5" />
                      Show Customer Reviews ({service.reviews})
                    </>
                  )}
                </button>
              </div>
              
              {showReviews && (
                <div className="mb-12">
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < service.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-lg font-medium">{service.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        {
                          name: "John D.",
                          avatar: "https://ui-avatars.com/api/?name=John+D&background=0D8ABC&color=fff",
                          rating: 5,
                          date: "2 weeks ago",
                          text: "Excellent service! The boosting was completed much faster than expected, and the communication was great throughout the process."
                        },
                        {
                          name: "Sarah M.",
                          avatar: "https://ui-avatars.com/api/?name=Sarah+M&background=0D8ABC&color=fff",
                          rating: 4,
                          date: "1 month ago",
                          text: "Very satisfied with the boosting service. Professional and efficient. Would use again for sure."
                        },
                        {
                          name: "Alex K.",
                          avatar: "https://ui-avatars.com/api/?name=Alex+K&background=0D8ABC&color=fff",
                          rating: 5,
                          date: "2 months ago",
                          text: "The best boosting service I've used. They were very professional and completed the boost quickly. Highly recommended!"
                        }
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <img 
                              src={review.avatar} 
                              alt={review.name} 
                              className="h-10 w-10 rounded-full mr-4"
                            />
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium text-gray-900 mr-2">{review.name}</h4>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex mt-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-600">{review.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
