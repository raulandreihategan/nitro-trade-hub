
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Updated game-specific categories
const categories = [
  "All Categories",
  "Boosting",
  "Coaching",
  "Currency",
  "Items & Skins",
  "Power Leveling",
  "Achievements",
  "Accounts",
  "Duo Queue"
];

// Updated games list with popular titles
const games = [
  "All Games",
  "League of Legends",
  "Valorant",
  "Fortnite",
  "World of Warcraft",
  "Call of Duty",
  "Apex Legends",
  "CS:GO",
  "Diablo 4",
  "Overwatch 2",
  "Dota 2",
  "Genshin Impact"
];

// Updated service data with more game-specific services
const services = [
  // League of Legends Services
  {
    id: "lol-boost-1",
    title: "League of Legends Rank Boost",
    description: "Fast rank boosting from Iron to Challenger by our professional LoL players.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 49.99,
    category: "Boosting",
    game: "League of Legends"
  },
  {
    id: "lol-coaching-1",
    title: "LoL Pro Coaching",
    description: "One-on-one coaching sessions with Diamond+ players to improve your skills and gameplay.",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 29.99,
    category: "Coaching",
    game: "League of Legends"
  },
  {
    id: "lol-skins-1",
    title: "LoL Skins Package",
    description: "Get access to premium and limited edition skins for your favorite champions.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 39.99,
    category: "Items & Skins",
    game: "League of Legends"
  },
  
  // Valorant Services
  {
    id: "valorant-boost-1",
    title: "Valorant Rank Boosting",
    description: "Boost your Valorant rank from Iron to Radiant with our professional players.",
    image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 54.99,
    category: "Boosting",
    game: "Valorant"
  },
  {
    id: "valorant-coaching-1",
    title: "Valorant Aim Training",
    description: "Improve your aim, game sense, and strategies with personalized coaching sessions.",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=1476&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 24.99,
    category: "Coaching",
    game: "Valorant"
  },
  {
    id: "valorant-skins-1",
    title: "Valorant Points Package",
    description: "Get Valorant Points to purchase premium weapon skins and battle passes at a discount.",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.6,
    price: 19.99,
    category: "Currency",
    game: "Valorant"
  },
  
  // Fortnite Services
  {
    id: "fortnite-vbucks-1",
    title: "Fortnite V-Bucks Bundle",
    description: "Discounted V-Bucks packages to purchase skins, emotes, and Battle Passes.",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?auto=format&fit=crop&q=80&w=1471&ixlib=rb-4.0.3",
    rating: 4.6,
    price: 19.99,
    category: "Currency",
    game: "Fortnite"
  },
  {
    id: "fortnite-wins-1",
    title: "Fortnite Victory Package",
    description: "Get guaranteed wins in Fortnite with our professional players carrying your account.",
    image: "https://images.unsplash.com/photo-1589241062272-c0a000072145?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 29.99,
    category: "Boosting",
    game: "Fortnite"
  },
  {
    id: "fortnite-challenges-1",
    title: "Battle Pass Challenges",
    description: "Complete all your Battle Pass challenges to unlock exclusive skins and rewards.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
    rating: 4.5,
    price: 34.99,
    category: "Achievements",
    game: "Fortnite"
  },
  
  // World of Warcraft Services
  {
    id: "wow-gold-1",
    title: "WoW Gold Package",
    description: "Safe and reliable World of Warcraft gold delivered to your character within hours.",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1504&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 24.99,
    category: "Currency",
    game: "World of Warcraft"
  },
  {
    id: "wow-leveling-1",
    title: "WoW Power Leveling",
    description: "Level your character from 1 to max level with our efficient boosting service.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 49.99,
    category: "Power Leveling",
    game: "World of Warcraft"
  },
  {
    id: "wow-mythic-1",
    title: "Mythic+ Dungeon Runs",
    description: "Complete high-level Mythic+ dungeons for gear, achievements, and season rewards.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 39.99,
    category: "Boosting",
    game: "World of Warcraft"
  }
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState(services);
  const { toast } = useToast();

  // Filter services based on selection
  useEffect(() => {
    let filtered = services;
    
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (selectedGame !== "All Games") {
      filtered = filtered.filter(service => service.game === selectedGame);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.game.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedCategory, selectedGame, searchQuery]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    
    toast({
      title: "Added to cart",
      description: `${service?.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-block bg-nitro-50 rounded-full px-3 py-1 text-xs font-medium text-nitro-700 mb-4">
                Our Services
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Premium Gaming Services
              </h1>
              <p className="text-gray-600">
                From boosting to coaching, items, currency, and more - we offer a wide range of services to help you elevate your gaming experience.
              </p>
            </div>
            
            {/* Search & Filter */}
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-nitro-500 focus:border-nitro-500"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Category filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 pr-8 appearance-none focus:ring-nitro-500 focus:border-nitro-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Game filter */}
                <div className="relative">
                  <select
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-8 appearance-none focus:ring-nitro-500 focus:border-nitro-500"
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                  >
                    {games.map((game) => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{filteredServices.length}</span> services
              </p>
            </div>
            
            {/* Services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  image={service.image}
                  rating={service.rating}
                  price={service.price}
                  category={service.category}
                />
              ))}
            </div>
            
            {/* Empty state */}
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSelectedGame("All Games");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
