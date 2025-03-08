
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Sample service categories for video games
const categories = [
  "All Categories",
  "Boosting",
  "Coaching",
  "Duo Queue",
  "Items & Skins",
  "Accounts",
  "Currency",
  "Power Leveling",
  "Achievements"
];

// Sample games list
const games = [
  "All Games",
  "League of Legends",
  "Valorant",
  "Call of Duty",
  "Fortnite",
  "World of Warcraft",
  "Dota 2",
  "CS:GO",
  "Overwatch",
  "Apex Legends",
  "Rainbow Six Siege"
];

// Sample extended service data
const services = [
  {
    id: "boost-1",
    title: "Rank Boosting",
    description: "Fast and reliable rank boosting by professional players. Achieve your desired rank in no time.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 49.99,
    category: "Boosting",
    game: "League of Legends"
  },
  {
    id: "coaching-1",
    title: "Pro Coaching",
    description: "One-on-one coaching sessions with professional players to improve your skills and gameplay.",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 29.99,
    category: "Coaching",
    game: "Valorant"
  },
  {
    id: "duo-1",
    title: "Duo Queue",
    description: "Play with a professional player who will help you win games and improve your rank.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 39.99,
    category: "Duo Queue",
    game: "Call of Duty"
  },
  {
    id: "skin-1",
    title: "Rare Skins Bundle",
    description: "Get access to rare and exclusive skins that will make your character stand out in the game.",
    image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.9,
    price: 79.99,
    category: "Items & Skins",
    game: "Fortnite"
  },
  {
    id: "account-1",
    title: "Ranked Account",
    description: "Get a pre-ranked account with all the champions/characters unlocked. Ready to play competitively.",
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.6,
    price: 99.99,
    category: "Accounts",
    game: "League of Legends"
  },
  {
    id: "currency-1",
    title: "Gold Coins Package",
    description: "Purchase in-game currency for a fraction of the official price. Safe and quick delivery.",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1504&ixlib=rb-4.0.3",
    rating: 4.8,
    price: 19.99,
    category: "Currency",
    game: "World of Warcraft"
  },
  {
    id: "level-1",
    title: "Power Leveling",
    description: "Quick leveling service to get your character to max level without the grind.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    rating: 4.7,
    price: 49.99,
    category: "Power Leveling",
    game: "World of Warcraft"
  },
  {
    id: "achievement-1",
    title: "Achievement Hunting",
    description: "Get those difficult achievements completed by our expert team of gamers.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
    rating: 4.5,
    price: 34.99,
    category: "Achievements",
    game: "Overwatch"
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
